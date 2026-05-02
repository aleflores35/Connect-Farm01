import { GoogleGenAI, Type } from "@google/genai";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

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
}
