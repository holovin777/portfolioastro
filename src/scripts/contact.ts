function qs<T extends Element>(sel: string, root: Document | Element = document): T | null {
  return root.querySelector(sel) as T | null;
}

const form = qs<HTMLFormElement>('#contactForm');
const btn  = qs<HTMLButtonElement>('#sendBtn');
const statusEl = qs<HTMLElement>('#status');

const API = form?.dataset.api ?? '';

function setStatus(msg: string, color = '') {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = color;
}

btn?.addEventListener('click', async () => {
  if (!form || !API) return;

  const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

  if (!data.name || !data.email?.includes('@') || !data.message) {
    setStatus('Please fill name, valid email, and message.', '#f87171');
    return;
  }
  if (data.company) { setStatus('Spam blocked.', '#f87171'); return; }

  btn.disabled = true;
  setStatus('Sending…');

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      mode: 'cors',
    });

    if (res.ok) {
      form.reset();
      setStatus('✅ Message sent! I’ll reply soon.', '#4ade80');
    } else {
      const body = await res.json().catch(() => ({}));
      setStatus('❌ ' + (body.error || 'Failed. Please try again.'), '#f87171');
    }
  } catch {
    setStatus('⚠️ Network error. Please try again.', '#facc15');
  } finally {
    btn.disabled = false;
  }
});