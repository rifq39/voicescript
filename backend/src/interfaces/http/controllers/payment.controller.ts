import { Request, Response, NextFunction } from 'express';
import { GetPaymentsUseCase } from '../../../application/use-cases/payment/get-payments.use-case';

export class PaymentController {
  constructor(private readonly getPayments: GetPaymentsUseCase) {}

  summary = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.getPayments.execute());
    } catch (e) { next(e); }
  };
}
