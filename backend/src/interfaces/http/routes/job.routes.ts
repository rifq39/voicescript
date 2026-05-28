import { Router } from 'express';
import { JobController } from '../controllers/job.controller';

export function jobRoutes(controller: JobController): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.post('/', controller.create);
  router.post('/:id/assign-reporter', controller.assignReporterHandler);
  router.post('/:id/assign-editor', controller.assignEditorHandler);
  router.patch('/:id/status', controller.advanceStatusHandler);
  return router;
}
