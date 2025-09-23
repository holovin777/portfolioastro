import { Resend } from "resend";

export async function post({ request, redirect }: { request: Request; redirect: any }) {
  // Parse form
  const form = await request.formData();
  const name = (form.get("name") || "").toString().trim();
  const email = (form.get("email") || "").toString().trim();
  const message = (form.get("message") || "").toString().trim();
  const honeypot = (form.get("company") || "").toString().trim(); // hidden field

  // Basic validation + spam check
  if (honeypot || !name || !email || !message || message.length > 5000) {
    return new Response("Bad request", { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Website <onboarding@resend.dev>";
  const to = process.env.RESEND_TO || "viktor@holovin.com";

  if (!apiKey) return new Response("Server not configured", { status: 500 });

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from,
      to,
      subject: "New contact message from holovin.com",
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      // You can add html as well if you like:
      // html: `<p><b>Name:</b> ${escape(name)}<br/><b>Email:</b> ${escape(email)}</p><pre>${escape(message)}</pre>`
    });
  } catch (e) {
    console.error("Resend error:", e);
    return new Response("Email failed", { status: 502 });
  }

  // Redirect back to show success message
  return redirect("/contact?sent=1", 303);
}
