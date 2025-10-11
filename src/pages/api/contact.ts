import type { APIContext } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

async function parseBody(req: Request): Promise<Record<string, string>> {
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    return await req.json()
  }
  if (ct.includes('application/x-www-form-urlencoded')) {
    const form = await req.formData()
    return Object.fromEntries(form.entries()) as Record<string, string>
  }
  return {}
}

export async function POST({ request }: APIContext) {
  try {
    const { name = '', email = '', message = '', company = '' } = await parseBody(request)

    // honeypot
    if (company) {
      return new Response(JSON.stringify({ ok: false }), { status: 400 })
    }

    // tiny validation
    if (!name.trim() || !email.includes('@') || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
    }

    const from = import.meta.env.RESEND_FROM || 'Website <onboarding@resend.dev>'
    const to = import.meta.env.RESEND_TO || 'delivered@resend.dev'

    const { error } = await resend.emails.send({
      from,
      to,
      subject: 'New contact from holovin.com',
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      replyTo: email,
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), { status: 500 })
  }
}
