import { Reporter } from './reporter';
import { Editor } from './editor';

export type JobStatus = 'NEW' | 'ASSIGNED' | 'TRANSCRIBED' | 'REVIEWED' | 'COMPLETED';
export type LocationType = 'physical' | 'remote';

export const STATUS_TRANSITIONS: Record<JobStatus, JobStatus | null> = {
  NEW: 'ASSIGNED',
  ASSIGNED: 'TRANSCRIBED',
  TRANSCRIBED: 'REVIEWED',
  REVIEWED: 'COMPLETED',
  COMPLETED: null,
};

export interface Job {
  id: number;
  caseName: string;
  duration: number;
  locationType: LocationType;
  city: string | null;
  status: JobStatus;
  reporterId: number | null;
  editorId: number | null;
  reporter?: Reporter | null;
  editor?: Editor | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewJob {
  caseName: string;
  duration: number;
  locationType: LocationType;
  city?: string | null;
}
