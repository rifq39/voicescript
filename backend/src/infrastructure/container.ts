import prisma from "./database/prisma"
import { PrismaJobRepository } from "./repositories/job.repository"
import { PrismaReporterRepository } from "./repositories/reporter.repository"
import { PrismaEditorRepository } from "./repositories/editor.repository"

import { CreateJobUseCase } from "../application/use-cases/job/create-job.use-case"
import { ListJobsUseCase } from "../application/use-cases/job/list-jobs.use-case"
import { GetJobUseCase } from "../application/use-cases/job/get-job.use-case"
import { AssignReporterUseCase } from "../application/use-cases/job/assign-reporter.use-case"
import { AssignEditorUseCase } from "../application/use-cases/job/assign-editor.use-case"
import { AdvanceStatusUseCase } from "../application/use-cases/job/advance-status.use-case"
import { ListReportersUseCase } from "../application/use-cases/reporter/list-reporters.use-case"
import { SuggestReportersUseCase } from "../application/use-cases/reporter/suggest-reporters.use-case"
import { ListEditorsUseCase } from "../application/use-cases/editor/list-editors.use-case"
import { GetPaymentsUseCase } from "../application/use-cases/payment/get-payments.use-case"

import { JobController } from "../interfaces/http/controllers/job.controller"
import { ReporterController } from "../interfaces/http/controllers/reporter.controller"
import { EditorController } from "../interfaces/http/controllers/editor.controller"
import { PaymentController } from "../interfaces/http/controllers/payment.controller"

// Repositories
const jobRepository = new PrismaJobRepository(prisma)
const ReporterRepository = new PrismaReporterRepository(prisma)
const editorRepository = new PrismaEditorRepository(prisma)

// Use Cases
const createJobUseCase = new CreateJobUseCase(jobRepository)
const listJobsUseCase = new ListJobsUseCase(jobRepository)
const getJobUseCase = new GetJobUseCase(jobRepository)
const assignReporterUseCase = new AssignReporterUseCase(jobRepository, ReporterRepository)
const assignEditorUseCase = new AssignEditorUseCase(jobRepository, editorRepository)
const advanceStatusUseCase = new AdvanceStatusUseCase(jobRepository)
const listReportersUseCase = new ListReportersUseCase(ReporterRepository)
const suggestReportersUseCase = new SuggestReportersUseCase(jobRepository, ReporterRepository)
const listEditorsUseCase = new ListEditorsUseCase(editorRepository)
const getPaymentsUseCase = new GetPaymentsUseCase(jobRepository)

// Controllers
export const jobController = new JobController(
  createJobUseCase,
  listJobsUseCase,
  getJobUseCase,
  assignReporterUseCase,
  assignEditorUseCase,
  advanceStatusUseCase
)
export const reporterController = new ReporterController(listReportersUseCase, suggestReportersUseCase)
export const editorController = new EditorController(listEditorsUseCase)
export const paymentController = new PaymentController(getPaymentsUseCase)
