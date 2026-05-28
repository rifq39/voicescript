import { Request, Response, NextFunction } from 'express';
import { ListReportersUseCase } from '../../../application/use-cases/reporter/list-reporters.use-case';
import { SuggestReportersUseCase } from '../../../application/use-cases/reporter/suggest-reporters.use-case';

export class ReporterController {
  constructor(
    private readonly listReporters: ListReportersUseCase,
    private readonly suggestReporters: SuggestReportersUseCase,
  ) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.listReporters.execute());
    } catch (e) { next(e); }
  };

  suggest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.suggestReporters.execute(Number(req.params.jobId)));
    } catch (e) { next(e); }
  };
}
