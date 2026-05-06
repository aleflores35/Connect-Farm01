// Comprime imagem client-side antes de enviar pro servidor.
// Estratégia: redimensiona pra caber em maxW × maxH preservando aspect ratio,
// converte pra JPEG quality 0.85 (boa razão tamanho/qualidade visual).
// Cloudinary depois converte pra WebP/AVIF e otimiza ainda mais.

export type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0..1
  mimeType?: "image/jpeg" | "image/webp" | "image/png";
};

const DEFAULTS: Required<CompressOptions> = {
  maxWidth: 1600,
  maxHeight: 900,
  quality: 0.85,
  mimeType: "image/jpeg",
};

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<{ dataUri: string; width: number; height: number; bytes: number }> {
  const opts = { ...DEFAULTS, ...options };

  if (!file.type.startsWith("image/")) {
    throw new Error("Arquivo selecionado não é uma imagem");
  }

  const dataUri = await readFileAsDataUri(file);
  const img = await loadImage(dataUri);

  const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, opts.maxWidth, opts.maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context não disponível");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const compressedDataUri = canvas.toDataURL(opts.mimeType, opts.quality);
  const bytes = approximateBase64Bytes(compressedDataUri);

  return { dataUri: compressedDataUri, width, height, bytes };
}

function readFileAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao decodificar imagem"));
    img.src = src;
  });
}

function fitWithin(srcW: number, srcH: number, maxW: number, maxH: number) {
  if (srcW <= maxW && srcH <= maxH) return { width: srcW, height: srcH };
  const ratio = Math.min(maxW / srcW, maxH / srcH);
  return { width: Math.round(srcW * ratio), height: Math.round(srcH * ratio) };
}

function approximateBase64Bytes(dataUri: string) {
  const base64 = dataUri.split(",")[1] || "";
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
