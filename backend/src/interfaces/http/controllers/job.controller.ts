import { Request, Response, NextFunction } from 'express';
import { CreateJobUseCase } from '../../../application/use-cases/job/create-job.use-case';
import { ListJobsUseCase } from '../../../application/use-cases/job/list-jobs.use-case';
import { GetJobUseCase } from '../../../application/use-cases/job/get-job.use-case';
import { AssignReporterUseCase } from '../../../application/use-cases/job/assign-reporter.use-case';
import { AssignEditorUseCase } from '../../../application/use-cases/job/assign-editor.use-case';
import { AdvanceStatusUseCase } from '../../../application/use-cases/job/advance-status.use-case';

export class JobController {
  constructor(
    private readonly createJob: CreateJobUseCase,
    private readonly listJobs: ListJobsUseCase,
    private readonly getJob: GetJobUseCase,
    private readonly assignReporter: AssignReporterUseCase,
    private readonly assignEditor: AssignEditorUseCase,
    private readonly advanceStatus: AdvanceStatusUseCase,
  ) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.listJobs.execute());
    } catch (e) { next(e); }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.getJob.execute(Number(req.params.id)));
    } catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { caseName, duration, locationType, city } = req.body;
      if (!caseName || !duration || !locationType) {
        res.status(400).json({ error: 'caseName, duration, and locationType are required' });
        return;
      }
      const job = await this.createJob.execute({ caseName, duration: Number(duration), locationType, city });
      res.status(201).json(job);
    } catch (e) { next(e); }
  };

  assignReporterHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reporterId } = req.body;
      if (!reporterId) { res.status(400).json({ error: 'reporterId is required' }); return; }
      res.json(await this.assignReporter.execute(Number(req.params.id), Number(reporterId)));
    } catch (e) { next(e); }
  };

  assignEditorHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { editorId } = req.body;
      if (!editorId) { res.status(400).json({ error: 'editorId is required' }); return; }
      res.json(await this.assignEditor.execute(Number(req.params.id), Number(editorId)));
    } catch (e) { next(e); }
  };

  advanceStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.advanceStatus.execute(Number(req.params.id)));
    } catch (e) { next(e); }
  };
}
