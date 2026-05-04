import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const MAX_MESSAGE_LEN = 5000;
const MAX_NAME_LEN = 200;
const MAX_PHONE_LEN = 50;

const trimToMax = (value, max) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

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
