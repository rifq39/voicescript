import { Job, LocationType, NewJob } from '../../../domain/entities/job';
import { JobRepository } from '../../../domain/repositories/job.repository';

interface Input {
  caseName: string
  duration: number
  locationType: string
  city?: string
}

export class CreateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(input: Input): Promise<Job> {
    if (!["physical", "remote"].includes(input.locationType)) {
      throw new Error('locationType must be "physical" or "remote"')
    }
    const dto: NewJob = {
      caseName: input.caseName,
      duration: input.duration,
      locationType: input.locationType as LocationType,
      city: input.locationType === "physical" ? (input.city ?? null) : null,
    }
    return this.jobRepository.create(dto)
  }
}
