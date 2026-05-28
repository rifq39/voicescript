import { Reporter } from "../entities/reporter"

export interface ReporterRepository {
  findAll(): Promise<Reporter[]>
  findById(id: number): Promise<Reporter | null>
  findAvailable(): Promise<Reporter[]>
}
