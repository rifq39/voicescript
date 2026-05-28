'use client';

import { useEffect, useState } from 'react';
import { Job, Reporter, Editor, suggestReporters, getEditors, assignReporter, assignEditor } from '@/lib/api';

interface Props {
  job: Job;
  mode: 'reporter' | 'editor';
  onClose: () => void;
  onDone: () => void;
}

function idr(amount: number) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export default function AssignModal({ job, mode, onClose, onDone }: Props) {
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [editors, setEditors] = useState<Editor[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'reporter') suggestReporters(job.id).then(setReporters);
    else getEditors().then(setEditors);
  }, [mode, job.id]);

  async function handleConfirm() {
    if (!selectedId) return;
    setLoading(true);
    try {
      if (mode === 'reporter') await assignReporter(job.id, selectedId);
      else await assignEditor(job.id, selectedId);
      onDone();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed';
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
        style={{ background: '#fff', borderRadius: 8, padding: 24, width: 420, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: 18 }}>
          Assign {mode === 'reporter' ? 'Reporter' : 'Editor'} — {job.caseName}
        </h3>

        {mode === 'reporter' && reporters.length === 0 && (
          <p style={{ color: '#6b7280' }}>No available reporters.</p>
        )}
        {mode === 'editor' && editors.length === 0 && (
          <p style={{ color: '#6b7280' }}>No available editors.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mode === 'reporter' &&
            reporters.map((r, i) => {
              const sameCity = job.locationType === 'physical' && job.city?.toLowerCase() === r.city.toLowerCase();
              return (
                <label
                  key={r.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    border: `2px solid ${selectedId === r.id ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: 6, cursor: 'pointer',
                    background: i === 0 && sameCity ? '#eff6ff' : '#fff',
                  }}
                >
                  <input type="radio" name="assignee" value={r.id} checked={selectedId === r.id} onChange={() => setSelectedId(r.id)} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>
                      {r.city}{sameCity && <span style={{ color: '#3b82f6', fontWeight: 600 }}> · Same city</span>} · {idr(r.ratePerMinute)}/min
                    </div>
                  </div>
                </label>
              );
            })}

          {mode === 'editor' &&
            editors.map((e) => (
              <label
                key={e.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  border: `2px solid ${selectedId === e.id ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: 6, cursor: 'pointer',
                }}
              >
                <input type="radio" name="assignee" value={e.id} checked={selectedId === e.id} onChange={() => setSelectedId(e.id)} />
                <div>
                  <div style={{ fontWeight: 600 }}>{e.name}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Flat fee: {idr(e.flatFee)}</div>
                </div>
              </label>
            ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId || loading}
            style={{ padding: '8px 16px', border: 'none', borderRadius: 6, background: selectedId ? '#3b82f6' : '#93c5fd', color: '#fff', cursor: selectedId ? 'pointer' : 'default', fontWeight: 600 }}
          >
            {loading ? 'Assigning…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
