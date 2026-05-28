'use client';

import { useState } from 'react';
import { Job, advanceJobStatus } from '@/lib/api';
import AssignModal from './assign-modal';

interface Props {
  job: Job;
  onRefresh: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: '#9ca3af',
  ASSIGNED: '#3b82f6',
  TRANSCRIBED: '#eab308',
  REVIEWED: '#f97316',
  COMPLETED: '#22c55e',
};

const STATUS_NEXT: Record<string, string> = {
  NEW: 'ASSIGNED',
  ASSIGNED: 'TRANSCRIBED',
  TRANSCRIBED: 'REVIEWED',
  REVIEWED: 'COMPLETED',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        background: STATUS_COLORS[status] ?? '#9ca3af',
        color: '#fff',
        borderRadius: 99,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {status}
    </span>
  );
}

export default function JobCard({ job, onRefresh }: Props) {
  const [modal, setModal] = useState<'reporter' | 'editor' | null>(null);
  const [advancing, setAdvancing] = useState(false);

  async function handleAdvance() {
    setAdvancing(true);
    try {
      await advanceJobStatus(job.id);
      onRefresh();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed';
      alert(msg);
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{job.caseName}</span>
          <StatusBadge status={job.status} />
        </div>

        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#6b7280' }}>
          <span>{job.duration} min</span>
          <span>·</span>
          <span>{job.locationType === 'physical' ? `Physical · ${job.city}` : 'Remote'}</span>
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
          <span>
            <strong>Reporter:</strong>{' '}
            {job.reporter ? job.reporter.name : <em style={{ color: '#9ca3af' }}>Unassigned</em>}
          </span>
          <span>
            <strong>Editor:</strong>{' '}
            {job.editor ? job.editor.name : <em style={{ color: '#9ca3af' }}>Unassigned</em>}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {job.status === 'NEW' && (
            <button
              onClick={() => setModal('reporter')}
              style={{ padding: '5px 12px', borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#dbeafe', color: '#1d4ed8' }}
            >
              Assign Reporter
            </button>
          )}
          {job.status === 'TRANSCRIBED' && (
            <button
              onClick={() => setModal('editor')}
              style={{ padding: '5px 12px', borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#fef3c7', color: '#92400e' }}
            >
              Assign Editor
            </button>
          )}
          {job.status !== 'COMPLETED' && (
            <button
              onClick={handleAdvance}
              disabled={advancing}
              style={{ padding: '5px 12px', borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#f3f4f6', color: '#374151' }}
            >
              {advancing ? '…' : `→ ${STATUS_NEXT[job.status]}`}
            </button>
          )}
        </div>
      </div>

      {modal && (
        <AssignModal
          job={job}
          mode={modal}
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); onRefresh(); }}
        />
      )}
    </>
  );
}
