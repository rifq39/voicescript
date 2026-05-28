import { Job } from "../../../domain/entities/job"
import { JobRepository } from "../../../domain/repositories/job.repository"

export class GetJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(id: number): Promise<Job> {
    const job = await this.jobRepository.findById(id)
    if (!job) throw new Error("Job not found")
    return job
  }
}
