import { PrismaClient } from "@prisma/client"
import { Reporter } from "../../domain/entities/reporter"
import { ReporterRepository } from "../../domain/repositories/reporter.repository"

export class PrismaReporterRepository implements ReporterRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Reporter[]> {
    return this.prisma.reporter.findMany({ orderBy: { name: "asc" } })
  }

  async findById(id: number): Promise<Reporter | null> {
    return this.prisma.reporter.findUnique({ where: { id } })
  }

  async findAvailable(): Promise<Reporter[]> {
    return this.prisma.reporter.findMany({ where: { available: true }, orderBy: { name: "asc" } })
  }
}
