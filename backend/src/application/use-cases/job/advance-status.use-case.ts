import { Job, JobStatus, STATUS_TRANSITIONS } from "../../../domain/entities/job"
import { JobRepository } from "../../../domain/repositories/job.repository"

export class AdvanceStatusUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: number): Promise<Job> {
    const job = await this.jobRepository.findById(jobId)
    if (!job) throw new Error("Job not found")
    if (job.status === "COMPLETED") throw new Error("Job is already completed")

    const next = STATUS_TRANSITIONS[job.status]
    if (!next) throw new Error("Cannot advance status")
    if (next === "ASSIGNED" && !job.reporterId) {
      throw new Error("Assign a reporter before advancing to ASSIGNED")
    }

    return this.jobRepository.updateStatus(jobId, next as JobStatus)
  }
}
