'use client';
import { useState } from 'react';

export default function QuoteTester() {
  const [form, setForm] = useState({
    serviceType: 'STANDARD',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1000,
    pets: false,
    addOns: [] as string[],
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const res = await fetch('/api/quotes/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: 16 }}>
      <h1>Quote Tester</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Service Type:
          <select
            value={form.serviceType}
            onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
          >
            <option>STANDARD</option>
            <option>DEEP</option>
            <option>MOVE_IN_OUT</option>
          </select>
        </label>
        <label>
          Bedrooms:
          <input
            type="number"
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
          />
        </label>
        <label>
          Bathrooms:
          <input
            type="number"
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
          />
        </label>
        <label>
          Square Feet:
          <input
            type="number"
            value={form.sqft}
            onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })}
          />
        </label>
        <label>
          Pets:
          <input
            type="checkbox"
            checked={form.pets}
            onChange={(e) => setForm({ ...form, pets: e.target.checked })}
          />
        </label>
        <button disabled={loading} type="submit">
          {loading ? 'Calculating…' : 'Get Quote'}
        </button>
      </form>
      {result && (
        <pre style={{ background: '#f6f6f6', padding: 12, marginTop: 16 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
