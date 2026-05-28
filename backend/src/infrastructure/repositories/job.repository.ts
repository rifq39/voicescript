import { PrismaClient } from '@prisma/client';
import { Job, JobStatus, NewJob } from '../../domain/entities/job';
import { JobRepository } from '../../domain/repositories/job.repository';

const JOB_INCLUDE = { reporter: true, editor: true } as const

export class PrismaJobRepository implements JobRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Job[]> {
    return this.prisma.job.findMany({ include: JOB_INCLUDE, orderBy: { createdAt: "desc" } }) as Promise<Job[]>
  }

  async findById(id: number): Promise<Job | null> {
    return this.prisma.job.findUnique({ where: { id }, include: JOB_INCLUDE }) as Promise<Job | null>
  }

  async findByStatuses(statuses: JobStatus[]): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { status: { in: statuses } },
      include: JOB_INCLUDE,
      orderBy: { createdAt: "desc" },
    }) as Promise<Job[]>
  }

  async create(data: NewJob): Promise<Job> {
    return this.prisma.job.create({
      data: {
        caseName: data.caseName,
        duration: data.duration,
        locationType: data.locationType,
        city: data.city ?? null,
      },
      include: JOB_INCLUDE,
    }) as Promise<Job>
  }

  async assignReporter(jobId: number, reporterId: number, nextStatus: JobStatus): Promise<Job> {
    return this.prisma.job.update({
      where: { id: jobId },
      data: { reporterId, status: nextStatus },
      include: JOB_INCLUDE,
    }) as Promise<Job>
  }

  async assignEditor(jobId: number, editorId: number, nextStatus: JobStatus): Promise<Job> {
    return this.prisma.job.update({
      where: { id: jobId },
      data: { editorId, status: nextStatus },
      include: JOB_INCLUDE,
    }) as Promise<Job>
  }

  async updateStatus(jobId: number, status: JobStatus): Promise<Job> {
    return this.prisma.job.update({
      where: { id: jobId },
      data: { status },
      include: JOB_INCLUDE,
    }) as Promise<Job>
  }
}
