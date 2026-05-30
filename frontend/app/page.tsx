'use client';

import { useState } from 'react';
import { useJobs } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import JobCard from '@/components/job-card';
import NewJobModal from '@/components/new-job-modal';
import PaymentSummary from '@/components/payment-summary';

type Tab = 'jobs' | 'payments';

const STATUS_ORDER: Record<string, number> = {
  NEW: 0, ASSIGNED: 1, TRANSCRIBED: 2, REVIEWED: 3, COMPLETED: 4,
};

const STATUSES = ['ALL', 'NEW', 'ASSIGNED', 'TRANSCRIBED', 'REVIEWED', 'COMPLETED'];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('jobs');
  const [showNewJob, setShowNewJob] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const { data: jobs, loading, refetch } = useJobs();

  const filtered = filter === 'ALL' ? jobs : jobs.filter((j) => j.status === filter);
  const sorted = [...filtered].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <>
      <nav className="bg-white border-b border-border px-8 flex gap-1">
        {(['jobs', 'payments'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-5 py-3 text-sm font-medium capitalize transition-colors',
              tab === t
                ? 'text-blue-700 border-b-2 border-blue-700'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="px-8 py-6 max-w-5xl mx-auto">
        {tab === 'jobs' && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={[
                      'px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
                      filter === s
                        ? 'bg-blue-50 border-blue-400 text-blue-700'
                        : 'bg-white border-border text-muted-foreground hover:border-blue-300',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button onClick={() => setShowNewJob(true)}>+ New Job</Button>
            </div>

            {loading && <p className="text-muted-foreground text-sm">Loading jobs…</p>}
            {!loading && sorted.length === 0 && (
              <p className="text-muted-foreground text-sm">No jobs found.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sorted.map((job) => (
                <JobCard key={job.id} job={job} onRefresh={refetch} />
              ))}
            </div>
          </>
        )}

        {tab === 'payments' && (
          <>
            <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
            <PaymentSummary />
          </>
        )}
      </main>

      {showNewJob && (
        <NewJobModal
          onClose={() => setShowNewJob(false)}
          onDone={() => { setShowNewJob(false); refetch(); }}
        />
      )}
    </>
  );
}
