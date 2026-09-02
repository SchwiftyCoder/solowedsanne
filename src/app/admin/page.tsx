'use client';

import { useEffect, useState } from 'react';
import { WEDDING_DETAILS } from '@/lib/wedding-details';

type Guest = { id: string; first_name: string; last_name: string; phone: string; table_number: string };
type SortKey = 'name' | 'phone' | 'table';

function compareGuests(a: Guest, b: Guest, key: SortKey): number {
  switch (key) {
    case 'name':
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    case 'phone':
      return a.phone.localeCompare(b.phone);
    case 'table':
      return a.table_number.localeCompare(b.table_number);
  }
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [show, setShow] = useState(true);
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });

  useEffect(() => {
    loadGuests();
  }, []);

  function loadGuests() {
    fetch('/api/admin/guests')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) { setLoadError(data.error); return; }
        setGuests(data.guests ?? []);
      })
      .catch(() => setLoadError('Could not load guest list.'));
  }

  function toggleSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }

  const sorted = guests
    ? [...guests].sort((a, b) => (sort.dir === 'asc' ? 1 : -1) * compareGuests(a, b, sort.key))
    : null;

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#B8860B' }}>
            Admin
          </p>
          <h1 className="font-serif text-2xl" style={{ color: '#2C2C2C' }}>
            Solomon &amp; Anne&apos;s Wedding
          </h1>
        </div>

        {/* Wedding info card */}
        <div className="rounded-2xl shadow-sm px-6 py-5 border mb-6 grid grid-cols-2 gap-4 text-sm"
          style={{ background: '#fff', borderColor: '#e8dfc8', color: '#2C2C2C' }}>
          <InfoStat label="Total Guests" value={loadError ? '—' : guests === null ? '…' : String(guests.length)} />
          <div className="col-span-2 text-xs pt-2 border-t" style={{ borderColor: '#f0e8d4', opacity: 0.7 }}>
            {WEDDING_DETAILS.dateText} &middot; {WEDDING_DETAILS.timeText} &middot; {WEDDING_DETAILS.venueName}, {WEDDING_DETAILS.venueAddress}
          </div>
        </div>

        <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
          <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#f0e8d4' }}>
            <h2 className="font-serif text-lg" style={{ color: '#2C2C2C' }}>
              Guest List{sorted ? ` (${sorted.length})` : ''}
            </h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setShow((p) => !p)} className="text-xs underline" style={{ color: '#B8860B' }}>
                {show ? 'Hide' : 'Show'}
              </button>
              <button onClick={loadGuests} className="text-xs underline" style={{ color: '#B8860B' }}>
                Refresh
              </button>
            </div>
          </div>

          {!show ? null : loadError ? (
            <p className="px-6 py-6 text-sm" style={{ color: '#B00020' }}>{loadError}</p>
          ) : sorted === null ? (
            <p className="px-6 py-6 text-sm" style={{ color: '#2C2C2C', opacity: 0.6 }}>Loading…</p>
          ) : sorted.length === 0 ? (
            <p className="px-6 py-6 text-sm" style={{ color: '#2C2C2C', opacity: 0.6 }}>No guests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left uppercase text-xs tracking-wide" style={{ color: '#B8860B' }}>
                    <SortableHeader className="px-6 py-2" label="Guest" sortKey="name" sort={sort} onSort={toggleSort} />
                    <SortableHeader className="px-4 py-2" label="Phone" sortKey="phone" sort={sort} onSort={toggleSort} />
                    <SortableHeader className="px-4 py-2" label="Table" sortKey="table" sort={sort} onSort={toggleSort} />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((g) => (
                    <tr key={g.id} className="border-t" style={{ borderColor: '#f5efdc', color: '#2C2C2C' }}>
                      <td className="px-6 py-2">{g.first_name} {g.last_name}</td>
                      <td className="px-4 py-2" style={{ opacity: 0.75 }}>{g.phone}</td>
                      <td className="px-4 py-2" style={{ opacity: 0.75 }}>{g.table_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; dir: 'asc' | 'desc' };
  onSort: (key: SortKey) => void;
  className: string;
}) {
  const active = sort.key === sortKey;
  return (
    <th className={className}>
      <button
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1 uppercase text-xs tracking-wide"
        style={{ color: '#B8860B' }}
      >
        {label}
        <span style={{ opacity: active ? 1 : 0.3 }}>{active && sort.dir === 'desc' ? '▼' : '▲'}</span>
      </button>
    </th>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide" style={{ color: '#B8860B' }}>{label}</p>
      <p className="font-serif text-lg">{value}</p>
    </div>
  );
}
