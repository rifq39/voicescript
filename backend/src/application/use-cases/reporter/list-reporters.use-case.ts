import { Reporter } from "../../../domain/entities/reporter"
import { ReporterRepository } from "../../../domain/repositories/reporter.repository"

export class ListReportersUseCase {
  constructor(private readonly reporterRepository: ReporterRepository) {}

  async execute(): Promise<Reporter[]> {
    return this.reporterRepository.findAll()
  }
}
