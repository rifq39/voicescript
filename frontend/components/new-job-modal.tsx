'use client';

import { useState } from 'react';
import { useCreateJob } from '@/lib/hooks';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface Props {
  onClose: () => void;
  onDone: () => void;
}

export default function NewJobModal({ onClose, onDone }: Props) {
  const [caseName, setCaseName] = useState('');
  const [duration, setDuration] = useState('');
  const [locationType, setLocationType] = useState<'physical' | 'remote'>('remote');
  const [city, setCity] = useState('');
  const { mutate: createJob, loading } = useCreateJob();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!caseName || !duration) return;
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
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="caseName">Case Name</Label>
            <Input
              id="caseName"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              placeholder="e.g. Smith vs. Jones"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 90"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Location Type</Label>
            <Select value={locationType} onValueChange={(v) => setLocationType(v as 'physical' | 'remote')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {locationType === 'physical' && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Jakarta"
                required
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
