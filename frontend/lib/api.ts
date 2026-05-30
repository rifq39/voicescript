import axios from 'axios';
import type { Editor, Job, PaymentSummary, Reporter } from './types';

export type { Editor, Job, JobStatus, PaymentJob, PaymentSummary, Reporter } from './types';

const api = axios.create({ baseURL: '/api' });

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
