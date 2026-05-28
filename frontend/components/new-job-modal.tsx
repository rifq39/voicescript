'use client';

import { useState } from 'react';
import { createJob } from '@/lib/api';

interface Props {
  onClose: () => void;
  onDone: () => void;
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 4,
  display: 'block',
};

export default function NewJobModal({ onClose, onDone }: Props) {
  const [caseName, setCaseName] = useState('');
  const [duration, setDuration] = useState('');
  const [locationType, setLocationType] = useState<'physical' | 'remote'>('remote');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!caseName || !duration) return;
    setLoading(true);
    try {
      await createJob({
        caseName,
        duration: Number(duration),
        locationType,
        city: locationType === 'physical' ? city : undefined,
      });
      onDone();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to create job';
      alert(msg);
      setLoading(false);
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 8, padding: 24, width: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 20px', fontSize: 18 }}>New Job</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Case Name</label>
            <input style={inputStyle} value={caseName} onChange={(e) => setCaseName(e.target.value)} placeholder="e.g. Smith vs. Jones" required />
          </div>
          <div>
            <label style={labelStyle}>Duration (minutes)</label>
            <input style={inputStyle} type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 90" required />
          </div>
          <div>
            <label style={labelStyle}>Location Type</label>
            <select style={inputStyle} value={locationType} onChange={(e) => setLocationType(e.target.value as 'physical' | 'remote')}>
              <option value="remote">Remote</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          {locationType === 'physical' && (
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Jakarta" required />
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ padding: '8px 16px', border: 'none', borderRadius: 6, background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
              {loading ? 'Creating…' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
