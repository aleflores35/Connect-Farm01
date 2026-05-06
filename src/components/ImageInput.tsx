import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Link as LinkIcon, Upload, Sparkles, Loader2, X, AlertCircle } from "lucide-react";
import { useT } from "../i18n/LangProvider";
import { compressImage, formatBytes } from "../lib/imageCompress";

const AI_LIMIT_PER_SESSION = 2;
const AI_COUNT_KEY = "cf-ai-image-count";

type Mode = "url" | "upload" | "ai";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ImageInput({ value, onChange }: Props) {
  const t = useT();
  const [mode, setMode] = useState<Mode>("url");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCount, setAiCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(AI_COUNT_KEY);
    setAiCount(stored ? parseInt(stored, 10) || 0 : 0);
  }, []);

  function bumpAiCount() {
    const next = aiCount + 1;
    setAiCount(next);
    sessionStorage.setItem(AI_COUNT_KEY, String(next));
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setBusy(true);
    try {
      const { dataUri, width, height, bytes } = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 900,
        quality: 0.85,
        mimeType: "image/jpeg",
      });

      console.info(`[ImageInput] comprimida: ${width}x${height} · ${formatBytes(bytes)}`);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUri }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.url) {
        throw new Error(payload?.error || `Falha no upload (HTTP ${res.status})`);
      }

      onChange(payload.url);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      console.error("Erro upload:", err);
      setError(err?.message || t("admin.image.errorUpload"));
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerate() {
    if (!aiPrompt.trim()) {
      setError(t("admin.image.errorPromptEmpty"));
      return;
    }
    if (aiCount >= AI_LIMIT_PER_SESSION) {
      setError(t("admin.image.errorAiLimit"));
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.url) {
        throw new Error(payload?.error || `Falha ao gerar (HTTP ${res.status})`);
      }
      onChange(payload.url);
      bumpAiCount();
      setAiPrompt("");
    } catch (err: any) {
      console.error("Erro gerar imagem:", err);
      setError(err?.message || t("admin.image.errorAi"));
    } finally {
      setBusy(false);
    }
  }

  const hasImage = Boolean(value);
  const aiRemaining = Math.max(0, AI_LIMIT_PER_SESSION - aiCount);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-container-low rounded-xl">
        <ModeTab active={mode === "url"} onClick={() => setMode("url")} icon={<LinkIcon size={14} />} label={t("admin.image.tabUrl")} />
        <ModeTab active={mode === "upload"} onClick={() => setMode("upload")} icon={<Upload size={14} />} label={t("admin.image.tabUpload")} />
        <ModeTab active={mode === "ai"} onClick={() => setMode("ai")} icon={<Sparkles size={14} />} label={t("admin.image.tabAi")} />
      </div>

      {/* Body por modo */}
      {mode === "url" && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("admin.image.urlPlaceholder")}
          className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-tertiary focus:outline-none"
        />
      )}

      {mode === "upload" && (
        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            disabled={busy}
            className="block w-full text-sm text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-tertiary file:text-white file:font-bold file:cursor-pointer hover:file:bg-tertiary/90 disabled:opacity-50"
          />
          <p className="text-xs text-on-surface-variant">{t("admin.image.uploadHint")}</p>
        </div>
      )}

      {mode === "ai" && (
        <div className="space-y-2">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t("admin.image.aiPlaceholder")}
            disabled={busy || aiRemaining === 0}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-tertiary focus:outline-none resize-none disabled:opacity-50"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-on-surface-variant">
              {t("admin.image.aiRemaining").replace("{count}", String(aiRemaining)).replace("{limit}", String(AI_LIMIT_PER_SESSION))}
            </span>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={busy || aiRemaining === 0 || !aiPrompt.trim()}
              className="bg-tertiary text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-tertiary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {busy ? t("admin.image.aiGenerating") : t("admin.image.aiGenerate")}
            </button>
          </div>
        </div>
      )}

      {/* Loading global */}
      {busy && mode !== "ai" && (
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Loader2 size={14} className="animate-spin" />
          {t("admin.image.uploading")}
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview */}
      {hasImage && (
        <div className="relative group rounded-xl overflow-hidden border border-outline-variant">
          <img src={value} alt="" className="w-full aspect-video object-cover" style={{ imageOrientation: "from-image" }} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
            aria-label={t("admin.image.removeImage")}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function ModeTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
        active
          ? "bg-white text-primary shadow-sm"
          : "text-on-surface-variant hover:text-primary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
