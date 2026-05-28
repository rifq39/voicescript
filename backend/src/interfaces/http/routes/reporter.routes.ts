import { Router } from 'express';
import { ReporterController } from '../controllers/reporter.controller';

export function reporterRoutes(controller: ReporterController): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/suggest/:jobId', controller.suggest);
  return router;
}
