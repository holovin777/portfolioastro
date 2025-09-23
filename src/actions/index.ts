import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:content'          // Astro's Zod
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const server = {
  send: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      message: z.string().min(1).max(5000),
      company: z.string().optional().default(''), // honeypot
    }),
    async handler({ name, email, message, company }) {
      // basic spam trap
      if (company) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Spam blocked' })
      }

      const from = import.meta.env.RESEND_FROM ?? 'Website <onboarding@resend.dev>'
      const to = import.meta.env.RESEND_TO ?? 'viktor@holovin.com'

      const { error } = await resend.emails.send({
        from,
        to,
        subject: 'New contact message from holovin.com',
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      })

      if (error) {
        throw new ActionError({ code: 'BAD_REQUEST', message: error.message })
      }

      // Return a small success object (we’ll use it client-side to redirect)
      return { ok: true }
    },
  }),
}
