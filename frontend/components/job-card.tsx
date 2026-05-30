'use client';

import { useState } from 'react';
import { Job } from '@/lib/api';
import { useAdvanceJobStatus } from '@/lib/hooks';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AssignModal from './assign-modal';

interface Props {
  job: Job;
  onRefresh: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-gray-400 text-white',
  ASSIGNED: 'bg-blue-500 text-white',
  TRANSCRIBED: 'bg-yellow-400 text-white',
  REVIEWED: 'bg-orange-400 text-white',
  COMPLETED: 'bg-green-500 text-white',
};

const STATUS_NEXT: Record<string, string> = {
  NEW: 'ASSIGNED', ASSIGNED: 'TRANSCRIBED', TRANSCRIBED: 'REVIEWED', REVIEWED: 'COMPLETED',
};

export default function JobCard({ job, onRefresh }: Props) {
  const [modal, setModal] = useState<'reporter' | 'editor' | null>(null);
  const { mutate: advance, loading: advancing } = useAdvanceJobStatus();

  async function handleAdvance() {
    try {
      await advance(job.id);
      onRefresh();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed';
      alert(msg);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-base">{job.caseName}</span>
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', STATUS_COLORS[job.status])}>
              {job.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {job.duration} min · {job.locationType === 'physical' ? `Physical · ${job.city}` : 'Remote'}
          </p>
        </CardHeader>

        <CardContent className="text-sm pb-2">
          <div className="flex gap-4">
            <span>
              <span className="font-medium">Reporter: </span>
              {job.reporter ? job.reporter.name : <em className="text-muted-foreground">Unassigned</em>}
            </span>
            <span>
              <span className="font-medium">Editor: </span>
              {job.editor ? job.editor.name : <em className="text-muted-foreground">Unassigned</em>}
            </span>
          </div>
        </CardContent>

        <CardFooter className="gap-2 flex-wrap">
          {job.status === 'NEW' && (
            <Button size="sm" variant="secondary" onClick={() => setModal('reporter')}>
              Assign Reporter
            </Button>
          )}
          {job.status === 'TRANSCRIBED' && (
            <Button size="sm" variant="secondary" onClick={() => setModal('editor')}>
              Assign Editor
            </Button>
          )}
          {job.status !== 'COMPLETED' && (
            <Button size="sm" variant="outline" onClick={handleAdvance} disabled={advancing}>
              {advancing ? '…' : `→ ${STATUS_NEXT[job.status]}`}
            </Button>
          )}
        </CardFooter>
      </Card>

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
