'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  attending: 'yes' | 'no' | '';
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function FormPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', email: '', phone: '', attending: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.last_name.trim()) e.last_name = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Valid email required';
    if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone.trim())) e.phone = 'Valid phone required';
    if (!form.attending) e.attending = 'Please select one';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    sessionStorage.setItem('rsvp_form', JSON.stringify({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      attending: form.attending === 'yes',
    }));
    router.push('/preview');
  }

  const field = (key: keyof FormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      setErrors(err => ({ ...err, [key]: undefined }));
    },
  });

  const inputCls = (key: keyof FormErrors) =>
    `w-full rounded-lg px-4 py-3 text-sm outline-none transition border ${errors[key] ? 'border-red-400' : ''}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: '#B8860B' }}>Your Details</p>
          <h1 className="font-serif text-3xl md:text-4xl" style={{ color: '#2C2C2C' }}>RSVP Form</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12" style={{ background: '#B8860B', opacity: 0.35 }} />
            <span style={{ color: '#B8860B' }}>✦</span>
            <div className="h-px w-12" style={{ background: '#B8860B', opacity: 0.35 }} />
          </div>
        </div>

        <div className="rounded-2xl shadow-sm px-8 py-10 border" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-2 gap-4">
              {(['first_name', 'last_name'] as const).map((key, i) => (
                <div key={key}>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>
                    {i === 0 ? 'First Name' : 'Last Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={i === 0 ? 'Jane' : 'Smith'}
                    className={inputCls(key)}
                    style={{ borderColor: errors[key] ? undefined : '#d6cbb0', color: '#2C2C2C' }}
                    {...field(key)}
                  />
                  {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>Email</label>
              <input type="email" placeholder="jane@example.com" className={inputCls('email')}
                style={{ borderColor: errors.email ? undefined : '#d6cbb0', color: '#2C2C2C' }} {...field('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>Phone</label>
              <input type="tel" placeholder="+1 555 000 0000" className={inputCls('phone')}
                style={{ borderColor: errors.phone ? undefined : '#d6cbb0', color: '#2C2C2C' }} {...field('phone')} />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: '#B8860B' }}>Will you attend?</label>
              <div className="grid grid-cols-2 gap-3">
                {(['yes', 'no'] as const).map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center justify-center gap-2 border rounded-lg py-3 cursor-pointer transition text-sm select-none"
                    style={{
                      background: form.attending === opt ? '#1B5E20' : 'transparent',
                      color: form.attending === opt ? '#fff' : '#2C2C2C',
                      borderColor: form.attending === opt ? '#1B5E20' : '#d6cbb0',
                    }}
                  >
                    <input
                      type="radio" name="attending" value={opt}
                      checked={form.attending === opt}
                      onChange={() => { setForm(f => ({ ...f, attending: opt })); setErrors(e => ({ ...e, attending: undefined })); }}
                      className="sr-only"
                    />
                    {opt === 'yes' ? 'Joyfully Accepts' : 'Regretfully Declines'}
                  </label>
                ))}
              </div>
              {errors.attending && <p className="mt-1 text-xs text-red-500">{errors.attending}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm tracking-widest uppercase text-white transition mt-2"
              style={{ background: '#B8860B' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#9a700a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#B8860B')}
            >
              Preview RSVP
            </button>
          </form>
        </div>

        <button onClick={() => router.push('/')} className="mt-4 w-full text-center text-xs transition"
          style={{ color: '#2C2C2C', opacity: 0.4 }}>
          ← Back
        </button>
      </div>
    </main>
  );
}
