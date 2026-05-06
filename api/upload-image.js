import { v2 as cloudinary } from "cloudinary";

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

const FOLDER = "connectfarm-blog";
const MAX_BASE64_LEN = 8 * 1024 * 1024; // ~6MB de imagem real (base64 ≈ 1.33x)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  if (!cloudinaryConfigured) {
    return res.status(503).json({ error: "Cloudinary não configurado no servidor" });
  }

  const { image } = req.body || {};

  if (!image || typeof image !== "string") {
    return res.status(400).json({ error: "Imagem (data URI base64) é obrigatória" });
  }

  if (!image.startsWith("data:image/")) {
    return res.status(400).json({ error: "Formato inválido. Esperado data URI image/*" });
  }

  if (image.length > MAX_BASE64_LEN) {
    return res.status(413).json({ error: "Imagem muito grande. Máximo ~5MB após compressão" });
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: FOLDER,
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
    console.error("Erro ao subir imagem pro Cloudinary:", err);
    return res.status(500).json({ error: "Erro ao subir imagem" });
  }
}
