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
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    attending: '',
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

  const inputClass = (key: keyof FormErrors) =>
    `w-full border rounded-lg px-4 py-3 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm ${
      errors[key] ? 'border-red-400' : 'border-stone-200'
    }`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-amber-700 mb-3">Your Details</p>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-800">RSVP Form</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-amber-700/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-700/60" />
            <div className="h-px w-12 bg-amber-700/40" />
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">First Name</label>
                <input type="text" placeholder="Jane" className={inputClass('first_name')} {...field('first_name')} />
                {errors.first_name && <p className="mt-1 text-red-500 text-xs">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">Last Name</label>
                <input type="text" placeholder="Smith" className={inputClass('last_name')} {...field('last_name')} />
                {errors.last_name && <p className="mt-1 text-red-500 text-xs">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">Email</label>
              <input type="email" placeholder="jane@example.com" className={inputClass('email')} {...field('email')} />
              {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">Phone</label>
              <input type="tel" placeholder="+1 555 000 0000" className={inputClass('phone')} {...field('phone')} />
              {errors.phone && <p className="mt-1 text-red-500 text-xs">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">Will you attend?</label>
              <div className="grid grid-cols-2 gap-3">
                {(['yes', 'no'] as const).map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center gap-2 border rounded-lg py-3 cursor-pointer transition text-sm select-none ${
                      form.attending === opt
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={opt}
                      checked={form.attending === opt}
                      onChange={() => { setForm(f => ({ ...f, attending: opt })); setErrors(e => ({ ...e, attending: undefined })); }}
                      className="sr-only"
                    />
                    {opt === 'yes' ? 'Joyfully Accepts' : 'Regretfully Declines'}
                  </label>
                ))}
              </div>
              {errors.attending && <p className="mt-1 text-red-500 text-xs">{errors.attending}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-stone-800 hover:bg-stone-700 text-white rounded-lg py-3 text-sm tracking-widest uppercase transition mt-2"
            >
              Preview RSVP
            </button>
          </form>
        </div>

        <button onClick={() => router.push('/')} className="mt-4 w-full text-center text-xs text-stone-400 hover:text-stone-600 transition">
          ← Back
        </button>
      </div>
    </main>
  );
}
