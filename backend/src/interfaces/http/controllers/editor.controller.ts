import { Request, Response, NextFunction } from 'express';
import { ListEditorsUseCase } from '../../../application/use-cases/editor/list-editors.use-case';

export class EditorController {
  constructor(private readonly listEditors: ListEditorsUseCase) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.listEditors.execute());
    } catch (e) { next(e); }
  };
}
