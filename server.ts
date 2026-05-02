import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
        from: "Canal de Denúncias <onboarding@resend.dev>",
        to: ["rodrigo@connectfarm.com.br"],
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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
