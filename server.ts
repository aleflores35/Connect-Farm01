import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for whistleblowing form
  app.post("/api/denuncia", async (req, res) => {
    const { isAnonymous, wantsContact, name, phone, message } = req.body;

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
