// Thin email sender. Uses Resend when RESEND_API_KEY is set, otherwise logs
// to the server console — good enough for local dev and for the client to
// wire up their own provider later. See README "Email".

interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Sagan Beauty <hello@saganbeauty.ch>";

  if (!apiKey) {
    console.log(`[email:dev] to=${to} subject="${subject}"\n${text}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!res.ok) {
    console.error("Failed to send email:", await res.text());
  }
}
