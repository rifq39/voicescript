'use client';

import { useCallback, useEffect, useState } from 'react';
import { getJobs, Job } from '@/lib/api';
import JobCard from '@/components/job-card';
import NewJobModal from '@/components/new-job-modal';
import PaymentSummary from '@/components/payment-summary';

type Tab = 'jobs' | 'payments';

const STATUS_ORDER: Record<string, number> = {
  NEW: 0,
  ASSIGNED: 1,
  TRANSCRIBED: 2,
  REVIEWED: 3,
  COMPLETED: 4,
};

const STATUSES = ['ALL', 'NEW', 'ASSIGNED', 'TRANSCRIBED', 'REVIEWED', 'COMPLETED'];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewJob, setShowNewJob] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const fetchJobs = useCallback(() => {
    setLoading(true);
    getJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const filtered = filter === 'ALL' ? jobs : jobs.filter((j) => j.status === filter);
  const sorted = [...filtered].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', gap: 4 }}>
        {(['jobs', 'payments'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: tab === t ? 700 : 400,
              background: tab === t ? '#1e40af' : 'transparent', color: tab === t ? '#fff' : '#6b7280',
              borderRadius: 6, textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </nav>

      <main style={{ padding: '24px 32px', maxWidth: 960, margin: '0 auto' }}>
        {tab === 'jobs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    style={{
                      padding: '4px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer', fontWeight: 600,
                      border: `1px solid ${filter === s ? '#3b82f6' : '#d1d5db'}`,
                      background: filter === s ? '#eff6ff' : '#fff',
                      color: filter === s ? '#1d4ed8' : '#6b7280',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowNewJob(true)}
                style={{ padding: '8px 18px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
              >
                + New Job
              </button>
            </div>

            {loading && <p style={{ color: '#6b7280' }}>Loading jobs…</p>}
            {!loading && sorted.length === 0 && <p style={{ color: '#6b7280' }}>No jobs found.</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 }}>
              {sorted.map((job) => (
                <JobCard key={job.id} job={job} onRefresh={fetchJobs} />
              ))}
            </div>
          </>
        )}

        {tab === 'payments' && (
          <>
            <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700 }}>Payment Summary</h2>
            <PaymentSummary />
          </>
        )}
      </main>

      {showNewJob && (
        <NewJobModal
          onClose={() => setShowNewJob(false)}
          onDone={() => { setShowNewJob(false); fetchJobs(); }}
        />
      )}
    </>
  );
}
