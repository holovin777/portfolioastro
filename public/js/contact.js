function qs(sel, root = document) { return root.querySelector(sel); }

function setStatus(el, msg, color = '') {
  if (!el) return;
  el.textContent = msg;
  el.style.color = color || '';
}

function bindContactForm() {
  const form = qs('#contactForm');
  if (!form || form.dataset.bound === '1') return;

  const statusEl = qs('#status', form);
  const API = form.dataset.api || '/api/contact';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    const { name = '', email = '', message = '', company = '' } = data;

    if (!name.trim() || !email.includes('@') || !message.trim()) {
      setStatus(statusEl, 'Please fill name, valid email, and message.', '#f87171');
      return;
    }
    if (company) { // honeypot
      setStatus(statusEl, 'Spam blocked.', '#f87171');
      return;
    }

    setStatus(statusEl, 'Sending…');

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company })
      });

      if (res.ok) {
        form.reset();
        setStatus(statusEl, '✅ Message sent! I’ll reply soon.', '#4ade80');
      } else {
        let body = {};
        try { body = await res.json(); } catch {}
        setStatus(statusEl, '❌ ' + (body.error || 'Failed. Please try again.'), '#f87171');
      }
    } catch {
      setStatus(statusEl, '⚠️ Network error. Please try again.', '#facc15');
    }
  });

  form.dataset.bound = '1';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindContactForm);
} else {
  bindContactForm();
}

document.addEventListener('astro:page-load', bindContactForm);
