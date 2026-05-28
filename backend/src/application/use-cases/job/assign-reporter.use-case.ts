import { Job } from "../../../domain/entities/job"
import { JobRepository } from "../../../domain/repositories/job.repository"
import { ReporterRepository } from "../../../domain/repositories/reporter.repository"

export class AssignReporterUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly reporterRepository: ReporterRepository
  ) {}

  async execute(jobId: number, reporterId: number): Promise<Job> {
    const job = await this.jobRepository.findById(jobId)
    if (!job) throw new Error("Job not found")
    if (job.status !== "NEW") throw new Error("Can only assign reporter when status is NEW")

    const reporter = await this.reporterRepository.findById(reporterId)
    if (!reporter) throw new Error("Reporter not found")
    if (!reporter.available) throw new Error("Reporter is not available")

    return this.jobRepository.assignReporter(jobId, reporterId, "ASSIGNED")
  }
}
