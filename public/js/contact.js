function qs(sel, root = document) {
  return root.querySelector(sel);
}

const form = qs('#contactForm');
const btn = qs('#sendBtn');
const statusEl = qs('#status');

const API = form && form.dataset.api ? form.dataset.api : '';

function setStatus(msg, color = '') {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = color;
}

if (btn) {
  btn.addEventListener('click', async () => {
    if (!form || !API) return;

    const data = Object.fromEntries(new FormData(form));

    if (!data.name || !data.email || !data.email.includes('@') || !data.message) {
      setStatus('Please fill name, valid email, and message.', '#f87171');
      return;
    }
    if (data.company) {
      setStatus('Spam blocked.', '#f87171');
      return;
    }

    btn.disabled = true;
    setStatus('Sending…');

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        setStatus('✅ Message sent! I’ll reply soon.', '#4ade80');
      } else {
        let body = {};
        try {
          body = await res.json();
        } catch (e) {}
        setStatus('❌ ' + (body.error || 'Failed. Please try again.'), '#f87171');
      }
    } catch (e) {
      setStatus('⚠️ Network error. Please try again.', '#facc15');
    } finally {
      btn.disabled = false;
    }
  });
}