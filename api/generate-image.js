import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";

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

const FOLDER = "connectfarm-blog/ai-generated";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

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

    const generated = response?.generatedImages?.[0]?.image?.imageBytes;
    if (!generated) {
      return res.status(502).json({ error: "Modelo não retornou imagem" });
    }

    const dataUri = `data:image/png;base64,${generated}`;

    const upload = await cloudinary.uploader.upload(dataUri, {
      folder: FOLDER,
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
    const message = err?.message || "Erro ao gerar imagem com IA";
    return res.status(500).json({ error: message });
  }
}
