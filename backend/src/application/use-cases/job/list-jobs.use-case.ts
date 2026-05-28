import { Job } from "../../../domain/entities/job"
import { JobRepository } from "../../../domain/repositories/job.repository"

export class ListJobsUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(): Promise<Job[]> {
    return this.jobRepository.findAll()
  }
}
