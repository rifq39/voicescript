import { Router } from 'express';
import { EditorController } from '../controllers/editor.controller';

export function editorRoutes(controller: EditorController): Router {
  const router = Router();
  router.get('/', controller.list);
  return router;
}
