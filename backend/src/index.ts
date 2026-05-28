import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { jobController, reporterController, editorController, paymentController } from './infrastructure/container';
import { jobRoutes } from './interfaces/http/routes/job.routes';
import { reporterRoutes } from './interfaces/http/routes/reporter.routes';
import { editorRoutes } from './interfaces/http/routes/editor.routes';
import { paymentRoutes } from './interfaces/http/routes/payment.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes(jobController));
app.use('/api/reporters', reporterRoutes(reporterController));
app.use('/api/editors', editorRoutes(editorController));
app.use('/api/payments', paymentRoutes(paymentController));

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.message.includes('not found') ? 404
    : err.message.includes('Cannot') || err.message.includes('only') || err.message.includes('required') || err.message.includes('must') ? 400
    : 500;
  res.status(status).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
