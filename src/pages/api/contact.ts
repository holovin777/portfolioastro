import { Resend } from 'resend'

export async function post({ request, redirect }) {
  const data = await request.formData()
  const name = (data.get('name')||'').toString().trim()
  const email = (data.get('email')||'').toString().trim()
  const message = (data.get('message')||'').toString().trim()
  if (!name || !email || !message) return new Response('Bad request', { status: 400 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.RESEND_FROM || 'Website <onboarding@resend.dev>',
    to: process.env.RESEND_TO || 'viktor@holovin.com',
    subject: 'New contact message from holovin.com',
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`
  })

  return redirect('/contact?sent=1', 303)
}
