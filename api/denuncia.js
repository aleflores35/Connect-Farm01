import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

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
      return res.status(200).json({ success: true, message: "Denúncia recebida (Simulação)" });
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

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Erro no servidor:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
