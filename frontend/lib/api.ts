import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export interface Reporter {
  id: number;
  name: string;
  city: string;
  available: boolean;
  ratePerMinute: number;
  jobs?: { id: number; status: string }[];
}

export interface Editor {
  id: number;
  name: string;
  available: boolean;
  flatFee: number;
  jobs?: { id: number; status: string }[];
}

export type JobStatus = 'NEW' | 'ASSIGNED' | 'TRANSCRIBED' | 'REVIEWED' | 'COMPLETED';

export interface Job {
  id: number;
  caseName: string;
  duration: number;
  locationType: 'physical' | 'remote';
  city: string | null;
  status: JobStatus;
  reporterId: number | null;
  editorId: number | null;
  reporter: Reporter | null;
  editor: Editor | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentJob extends Job {
  reporterPay: number;
  editorPay: number;
  totalPay: number;
}

export interface PaymentSummary {
  jobs: PaymentJob[];
  totals: { reporterPay: number; editorPay: number; total: number };
}

export const getJobs = () => api.get<Job[]>('/jobs').then((r) => r.data);

export const createJob = (data: { caseName: string; duration: number; locationType: string; city?: string }) =>
  api.post<Job>('/jobs', data).then((r) => r.data);

export const assignReporter = (jobId: number, reporterId: number) =>
  api.post<Job>(`/jobs/${jobId}/assign-reporter`, { reporterId }).then((r) => r.data);

export const assignEditor = (jobId: number, editorId: number) =>
  api.post<Job>(`/jobs/${jobId}/assign-editor`, { editorId }).then((r) => r.data);

export const advanceJobStatus = (jobId: number) =>
  api.patch<Job>(`/jobs/${jobId}/status`).then((r) => r.data);

export const getReporters = () => api.get<Reporter[]>('/reporters').then((r) => r.data);

export const suggestReporters = (jobId: number) =>
  api.get<Reporter[]>(`/reporters/suggest/${jobId}`).then((r) => r.data);

export const getEditors = () => api.get<Editor[]>('/editors').then((r) => r.data);

export const getPayments = () => api.get<PaymentSummary>('/payments').then((r) => r.data);
