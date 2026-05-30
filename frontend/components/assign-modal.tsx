'use client';

import { Job, Reporter, Editor } from '@/lib/api';
import { useSuggestReporters, useEditors, useAssignReporter, useAssignEditor } from '@/lib/hooks';
import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: reporters } = useSuggestReporters(job.id);
  const { data: editors } = useEditors();
  const { mutate: doAssignReporter, loading: assigningReporter } = useAssignReporter();
  const { mutate: doAssignEditor, loading: assigningEditor } = useAssignEditor();

  const loading = assigningReporter || assigningEditor;
  const list: (Reporter | Editor)[] = mode === 'reporter' ? reporters : editors;

  async function handleConfirm() {
    if (!selectedId) return;
    try {
      if (mode === 'reporter') await doAssignReporter(job.id, selectedId);
      else await doAssignEditor(job.id, selectedId);
      onDone();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed';
      alert(msg);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Assign {mode === 'reporter' ? 'Reporter' : 'Editor'} — {job.caseName}
          </DialogTitle>
        </DialogHeader>

        {list.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No available {mode === 'reporter' ? 'reporters' : 'editors'}.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {mode === 'reporter' &&
            (reporters as Reporter[]).map((r, i) => {
              const sameCity = job.locationType === 'physical' && job.city?.toLowerCase() === r.city.toLowerCase();
              return (
                <label
                  key={r.id}
                  className={cn(
                    'flex items-center gap-3 rounded-md border-2 px-3 py-2.5 cursor-pointer transition-colors',
                    selectedId === r.id ? 'border-blue-500 bg-blue-50' : 'border-border hover:border-blue-300',
                    i === 0 && sameCity && selectedId !== r.id && 'bg-blue-50/50',
                  )}
                >
                  <input
                    type="radio" name="assignee" value={r.id}
                    checked={selectedId === r.id} onChange={() => setSelectedId(r.id)}
                    className="accent-blue-600"
                  />
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.city}
                      {sameCity && <span className="text-blue-600 font-semibold"> · Same city</span>}
                      {' · '}{idr(r.ratePerMinute)}/min
                    </div>
                  </div>
                </label>
              );
            })}

          {mode === 'editor' &&
            (editors as Editor[]).map((e) => (
              <label
                key={e.id}
                className={cn(
                  'flex items-center gap-3 rounded-md border-2 px-3 py-2.5 cursor-pointer transition-colors',
                  selectedId === e.id ? 'border-blue-500 bg-blue-50' : 'border-border hover:border-blue-300',
                )}
              >
                <input
                  type="radio" name="assignee" value={e.id}
                  checked={selectedId === e.id} onChange={() => setSelectedId(e.id)}
                  className="accent-blue-600"
                />
                <div>
                  <div className="font-semibold text-sm">{e.name}</div>
                  <div className="text-xs text-muted-foreground">Flat fee: {idr(e.flatFee)}</div>
                </div>
              </label>
            ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedId || loading}>
            {loading ? 'Assigning…' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
