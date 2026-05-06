import express from "express";
import path from "path";
import { Resend } from "resend";
import { GoogleGenAI, Type } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Configuráveis via env vars do ambiente (AWS / Vercel / .env local) sem precisar redeploy de código.
// FROM precisa ser email/domínio verificado no Resend (ou sandbox onboarding@resend.dev no início).
// TO é o destinatário; em sandbox precisa ser email verificado na conta Resend.
const DENUNCIA_FROM_EMAIL =
  process.env.DENUNCIA_FROM_EMAIL || "Canal de Denúncias <onboarding@resend.dev>";
const DENUNCIA_TO_EMAIL = process.env.DENUNCIA_TO_EMAIL || "rodrigo@connectfarm.com.br";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Limit aumentado de 100kb default pra 10mb por causa de upload de imagem em base64.
  app.use(express.json({ limit: "10mb" }));

  // API route for whistleblowing form
  app.post("/api/denuncia", async (req, res) => {
    const MAX_MESSAGE_LEN = 5000;
    const MAX_NAME_LEN = 200;
    const MAX_PHONE_LEN = 50;
    const trimToMax = (value: unknown, max: number): string => {
      if (typeof value !== "string") return "";
      return value.trim().slice(0, max);
    };

    const body = req.body || {};

    // Honeypot: real users never fill this hidden field. Bots do.
    // Return 200 silently to avoid teaching attackers we detected them.
    if (body.website && String(body.website).trim().length > 0) {
      return res.status(200).json({ success: true });
    }

    const isAnonymous = Boolean(body.isAnonymous);
    const wantsContact = Boolean(body.wantsContact);
    const message = trimToMax(body.message, MAX_MESSAGE_LEN);
    const name = trimToMax(body.name, MAX_NAME_LEN);
    const phone = trimToMax(body.phone, MAX_PHONE_LEN);

    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória" });
    }

    const emailContent = `
      Nova Denúncia Recebida:
      -----------------------
      Anônima: ${isAnonymous ? "Sim" : "Não"}
      Deseja contato: ${wantsContact ? "Sim" : "Não"}
      Nome: ${isAnonymous ? "Anônimo" : (name || "Não informado")}
      Telefone: ${isAnonymous ? "Anônimo" : (phone || "Não informado")}

      Mensagem:
      ${message}
    `;

    try {
      if (!resend) {
        console.warn("RESEND_API_KEY não configurada. Simulando envio de e-mail.");
        console.log("Conteúdo do e-mail:", emailContent);
        return res.json({ success: true, message: "Denúncia recebida (Simulação)" });
      }

      const { data, error } = await resend.emails.send({
        from: DENUNCIA_FROM_EMAIL,
        to: [DENUNCIA_TO_EMAIL],
        subject: "Nova Denúncia - ConnectFARM",
        text: emailContent,
      });

      if (error) {
        console.error("Erro ao enviar e-mail:", error);
        return res.status(500).json({ error: "Erro ao enviar denúncia" });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Erro no servidor:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  // API route for AI blog post generation (Gemini)
  app.post("/api/generate-post", async (req, res) => {
    const { topic } = req.body || {};

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return res.status(400).json({ error: "Tópico é obrigatório" });
    }

    if (topic.length > 500) {
      return res.status(400).json({ error: "Tópico muito longo (máx 500 caracteres)" });
    }

    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY não configurada no servidor" });
    }

    try {
      const prompt = `Escreva um artigo de blog profissional para a ConnectFARM (empresa de AgTech focada em inteligência de dados e diagnóstico de solo).
        Tema: ${topic}
        O artigo deve ter um tom técnico porém acessível para produtores rurais.
        O conteúdo deve ter entre 300 e 600 palavras.
        Inclua um resumo curto (excerpt) e o conteúdo completo.`;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          systemInstruction:
            "Você é um redator especializado em agronegócio e tecnologia. Responda apenas em formato JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ["title", "excerpt", "content", "category"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");

      if (!data.title) {
        return res.status(502).json({ error: "Resposta inválida do modelo" });
      }

      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Erro ao gerar post:", err);
      return res.status(500).json({ error: "Erro ao gerar conteúdo com IA" });
    }
  });

  // API route for blog post translation PT → EN, ES (Gemini)
  app.post("/api/translate-post", async (req, res) => {
    const MAX_FIELD_LEN = 50000;
    const trimToMax = (value: unknown, max: number): string => {
      if (typeof value !== "string") return "";
      return value.trim().slice(0, max);
    };

    const body = req.body || {};
    const title = trimToMax(body.title, MAX_FIELD_LEN);
    const excerpt = trimToMax(body.excerpt, MAX_FIELD_LEN);
    const content = trimToMax(body.content, MAX_FIELD_LEN);

    if (!title || !excerpt || !content) {
      return res.status(400).json({ error: "title, excerpt e content (em PT) são obrigatórios" });
    }

    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY não configurada no servidor" });
    }

    try {
      const prompt = `Traduza o post de blog abaixo do português para inglês (en) e espanhol (es).
Mantenha o tom técnico-acessível, preserve formatação Markdown (cabeçalhos, listas, links, ênfase) e termos técnicos do agronegócio.
Não traduza nomes próprios (ConnectFARM, NDVI, RVI, IGA, SAR etc).

PT - Title:
${title}

PT - Excerpt:
${excerpt}

PT - Content (Markdown):
${content}`;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          systemInstruction:
            "Você é um tradutor especializado em agronegócio e tecnologia. Traduza preservando significado técnico e nuance editorial. Responda apenas em formato JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              en: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  excerpt: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ["title", "excerpt", "content"],
              },
              es: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  excerpt: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ["title", "excerpt", "content"],
              },
            },
            required: ["en", "es"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");

      if (!data?.en?.title || !data?.es?.title) {
        return res.status(502).json({ error: "Resposta inválida do modelo" });
      }

      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Translation error:", err);
      return res.status(500).json({ error: "Erro ao traduzir conteúdo com IA" });
    }
  });

  // API route for image upload to Cloudinary (admin uploads from PC)
  app.post("/api/upload-image", async (req, res) => {
    if (!cloudinaryConfigured) {
      return res.status(503).json({ error: "Cloudinary não configurado no servidor" });
    }

    const { image } = req.body || {};
    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Imagem (data URI base64) é obrigatória" });
    }
    if (image.length > 8 * 1024 * 1024) {
      return res.status(413).json({ error: "Imagem muito grande. Máximo ~5MB após compressão" });
    }

    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: "connectfarm-blog",
        resource_type: "image",
        format: "webp",
        transformation: [{ width: 1600, height: 900, crop: "limit", quality: "auto:good" }],
      });
      return res.status(200).json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      });
    } catch (err) {
      console.error("Erro upload Cloudinary:", err);
      return res.status(500).json({ error: "Erro ao subir imagem" });
    }
  });

  // API route for AI image generation (Imagen 3 -> Cloudinary)
  app.post("/api/generate-image", async (req, res) => {
    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY não configurada no servidor" });
    }
    if (!cloudinaryConfigured) {
      return res.status(503).json({ error: "Cloudinary não configurado no servidor" });
    }

    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt é obrigatório" });
    }
    if (prompt.length > 1000) {
      return res.status(400).json({ error: "Prompt muito longo (máx 1000 caracteres)" });
    }

    try {
      const response = await ai.models.generateImages({
        model: "imagen-3.0-fast-generate-001",
        prompt,
        config: {
          numberOfImages: 1,
          aspectRatio: "16:9",
          outputMimeType: "image/png",
        },
      });

      const generated = (response as any)?.generatedImages?.[0]?.image?.imageBytes;
      if (!generated) {
        return res.status(502).json({ error: "Modelo não retornou imagem" });
      }

      const dataUri = `data:image/png;base64,${generated}`;
      const upload = await cloudinary.uploader.upload(dataUri, {
        folder: "connectfarm-blog/ai-generated",
        resource_type: "image",
        format: "webp",
        transformation: [{ width: 1600, height: 900, crop: "limit", quality: "auto:good" }],
        context: { prompt: prompt.slice(0, 500) },
      });

      return res.status(200).json({
        success: true,
        url: upload.secure_url,
        publicId: upload.public_id,
        width: upload.width,
        height: upload.height,
        bytes: upload.bytes,
        prompt,
      });
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      const message = (err as any)?.message || "Erro ao gerar imagem com IA";
      return res.status(500).json({ error: message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  return app;
}

const appPromise = startServer();
export default appPromise;
