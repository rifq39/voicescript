import { Job } from "../../../domain/entities/job"
import { JobRepository } from "../../../domain/repositories/job.repository"
import { EditorRepository } from "../../../domain/repositories/editor.repository"

export class AssignEditorUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly editorRepository: EditorRepository
  ) {}

  async execute(jobId: number, editorId: number): Promise<Job> {
    const job = await this.jobRepository.findById(jobId)
    if (!job) throw new Error("Job not found")
    if (job.status !== "TRANSCRIBED") throw new Error("Can only assign editor when status is TRANSCRIBED")

    const editor = await this.editorRepository.findById(editorId)
    if (!editor) throw new Error("Editor not found")
    if (!editor.available) throw new Error("Editor is not available")

    return this.jobRepository.assignEditor(jobId, editorId, "REVIEWED")
  }
}
