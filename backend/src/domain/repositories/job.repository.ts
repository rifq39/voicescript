import { Job, JobStatus, NewJob } from '../entities/job';

export interface JobRepository {
  findAll(): Promise<Job[]>
  findById(id: number): Promise<Job | null>
  findByStatuses(statuses: JobStatus[]): Promise<Job[]>
  create(data: NewJob): Promise<Job>
  assignReporter(jobId: number, reporterId: number, nextStatus: JobStatus): Promise<Job>
  assignEditor(jobId: number, editorId: number, nextStatus: JobStatus): Promise<Job>
  updateStatus(jobId: number, status: JobStatus): Promise<Job>
}
