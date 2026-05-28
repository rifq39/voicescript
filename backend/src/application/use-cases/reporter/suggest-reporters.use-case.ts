import { Reporter } from "../../../domain/entities/reporter"
import { ReporterRepository } from "../../../domain/repositories/reporter.repository"
import { JobRepository } from "../../../domain/repositories/job.repository"

export class SuggestReportersUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly reporterRepository: ReporterRepository
  ) {}

  async execute(jobId: number): Promise<Reporter[]> {
    const job = await this.jobRepository.findById(jobId)
    if (!job) throw new Error("Job not found")

    const reporters = await this.reporterRepository.findAvailable()

    return reporters.sort((a, b) => {
      if (job.locationType === "physical" && job.city) {
        const aMatch = a.city.toLowerCase() === job.city.toLowerCase()
        const bMatch = b.city.toLowerCase() === job.city.toLowerCase()
        if (aMatch && !bMatch) return -1
        if (!aMatch && bMatch) return 1
      }
      return a.name.localeCompare(b.name)
    })
  }
}
