import { Resend } from 'resend';

export async function post({ request, redirect }: { request: Request; redirect: any }) {
  const form = await request.formData();
  const name = (form.get('name') || '').toString().trim();
  const email = (form.get('email') || '').toString().trim();
  const message = (form.get('message') || '').toString().trim();
  const honeypot = (form.get('company') || '').toString().trim(); // spam trap

  if (honeypot || !name || !email || !message) {
    return new Response('Bad request', { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM || 'Website <onboarding@resend.dev>';
  const to = process.env.RESEND_TO || 'viktor@holovin.com';

  try {
    await resend.emails.send({
      from,
      to,
      subject: 'New contact message from holovin.com',
      // plain text is simplest & reliable
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      // or add HTML if you prefer:
      // html: `<p><b>Name:</b> ${escapeHtml(name)}<br/><b>Email:</b> ${escapeHtml(email)}</p><pre>${escapeHtml(message)}</pre>`
    });
  } catch (err) {
    console.error('Resend error:', err);
    return new Response('Email failed', { status: 502 });
  }

  return redirect('/contact?sent=1', 303);
}

// Optional if you use the HTML version above
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!));
}
