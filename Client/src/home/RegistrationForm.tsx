import { type FormEvent, useMemo, useState } from 'react';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  consent: boolean;
}

export default function RegistrationForm() {
  const [data, setData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { ok: boolean; message: string }>(null);

  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

  const isEmailValid = useMemo(() => /.+@.+\..+/.test(data.email), [data.email]);
  const isNameValid = useMemo(() => data.firstName.trim().length > 0 && data.lastName.trim().length > 0, [data.firstName, data.lastName]);

  const canSubmit = isEmailValid && isNameValid && data.consent && !submitting;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitted(null);

    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      address: data.address?.trim() || undefined,
      source: 'Lucky7-Web',
      consent: data.consent,
      ts: new Date().toISOString(),
    };

    try {
      if (apiUrl) {
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setSubmitted({ ok: true, message: 'Thanks! You\'re registered for the next draw. We\'ll be in touch.' });
      } else {
        // Fallback: store locally and simulate success
        const key = 'lucky7_registrations';
        const existingRaw = localStorage.getItem(key);
        const existing = existingRaw ? (JSON.parse(existingRaw) as unknown[]) : [];
        existing.push(payload);
        localStorage.setItem(key, JSON.stringify(existing));
        setSubmitted({ ok: true, message: "Thanks! You're registered for the next draw. (Offline mode)" });
      }
      // Reset form (keep email for confirmation if desired)
      setData({ firstName: '', lastName: '', email: '', phone: '', address: '', consent: false });
    } catch (err: unknown) {
      console.error('Registration failed', err);
      setSubmitted({ ok: false, message: 'Sorry, something went wrong. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} aria-label="Lucky 7 registration form" style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={data.firstName}
            onChange={(e) => setData((d) => ({ ...d, firstName: e.target.value }))}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={data.lastName}
            onChange={(e) => setData((d) => ({ ...d, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
          required
          aria-invalid={!isEmailValid}
        />
      </div>

      <div>
        <label htmlFor="phone">Phone (optional)</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="address">Address (optional)</label>
        <textarea
          id="address"
          name="address"
          value={data.address}
          onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
          rows={3}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'start' }}>
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={data.consent}
          onChange={(e) => setData((d) => ({ ...d, consent: e.target.checked }))}
          required
        />
        <label htmlFor="consent" style={{ marginTop: -2 }}>
          I consent to Stourbridge FC contacting me about the Lucky 7 draw and understand that by registering I will be added to the next draw. I can opt out at any time.
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={!canSubmit}>
          {submitting ? 'Submitting…' : 'Register for the next draw'}
        </button>
      </div>

      {submitted && (
        <div role="status" style={{ marginTop: 12, color: submitted.ok ? 'green' : 'crimson' }}>
          {submitted.message}
        </div>
      )}
    </form>
  );
}
