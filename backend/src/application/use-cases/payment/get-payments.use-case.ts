import { JobRepository } from "../../../domain/repositories/job.repository"

export interface PaymentBreakdown {
  jobId: number
  caseName: string
  duration: number
  reporterName: string | null
  editorName: string | null
  reporterPay: number
  editorPay: number
  totalPay: number
}

export interface PaymentSummary {
  jobs: PaymentBreakdown[]
  totals: { reporterPay: number; editorPay: number; total: number }
}

export class GetPaymentsUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(): Promise<PaymentSummary> {
    const jobs = await this.jobRepository.findByStatuses(["REVIEWED", "COMPLETED"])

    const breakdown: PaymentBreakdown[] = jobs.map((job) => {
      const reporterPay = job.reporter ? job.duration * job.reporter.ratePerMinute : 0
      const editorPay = job.editor ? job.editor.flatFee : 0
      return {
        jobId: job.id,
        caseName: job.caseName,
        duration: job.duration,
        reporterName: job.reporter?.name ?? null,
        editorName: job.editor?.name ?? null,
        reporterPay,
        editorPay,
        totalPay: reporterPay + editorPay,
      }
    })

    const totals = breakdown.reduce(
      (acc, j) => ({
        reporterPay: acc.reporterPay + j.reporterPay,
        editorPay: acc.editorPay + j.editorPay,
        total: acc.total + j.totalPay,
      }),
      { reporterPay: 0, editorPay: 0, total: 0 }
    )

    return { jobs: breakdown, totals }
  }
}
