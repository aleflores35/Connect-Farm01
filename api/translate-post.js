import { GoogleGenAI, Type } from "@google/genai";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const MAX_FIELD_LEN = 50000;

const trimToMax = (value, max) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

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
}
