import { GetPaymentsUseCase } from '../application/use-cases/payment/get-payments.use-case';
import { JobRepository } from '../domain/repositories/job.repository';
import { makeJob, makeReporter, makeEditor } from './fixtures';

function makeRepo(jobs = [makeJob()]) {
  const repo: jest.Mocked<JobRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByStatuses: jest.fn().mockResolvedValue(jobs),
    create: jest.fn(),
    assignReporter: jest.fn(),
    assignEditor: jest.fn(),
    updateStatus: jest.fn(),
  };
  return repo;
}

describe('GetPaymentsUseCase', () => {
  describe('reporter pay — per minute', () => {
    it('calculates reporter pay as duration × ratePerMinute', async () => {
      const reporter = makeReporter({ ratePerMinute: 2000 });
      const job = makeJob({ duration: 90, reporter, status: 'COMPLETED' });
      const useCase = new GetPaymentsUseCase(makeRepo([job]));

      const { jobs } = await useCase.execute();

      expect(jobs[0].reporterPay).toBe(180_000); // 90 × 2000
    });

    it('uses the reporter own rate, not a fixed global rate', async () => {
      const reporter = makeReporter({ ratePerMinute: 5000 });
      const job = makeJob({ duration: 60, reporter, status: 'COMPLETED' });
      const useCase = new GetPaymentsUseCase(makeRepo([job]));

      const { jobs } = await useCase.execute();

      expect(jobs[0].reporterPay).toBe(300_000); // 60 × 5000
    });

    it('sets reporter pay to 0 when no reporter is assigned', async () => {
      const job = makeJob({ reporter: null, status: 'COMPLETED' });
      const useCase = new GetPaymentsUseCase(makeRepo([job]));

      const { jobs } = await useCase.execute();

      expect(jobs[0].reporterPay).toBe(0);
    });
  });

  describe('editor pay — flat fee', () => {
    it('calculates editor pay as the flat fee regardless of duration', async () => {
      const editor = makeEditor({ flatFee: 150_000 });
      const jobShort = makeJob({ duration: 30,  editor, status: 'COMPLETED' });
      const jobLong  = makeJob({ duration: 300, editor, status: 'COMPLETED', id: 2 });
      const useCase = new GetPaymentsUseCase(makeRepo([jobShort, jobLong]));

      const { jobs } = await useCase.execute();

      expect(jobs[0].editorPay).toBe(150_000);
      expect(jobs[1].editorPay).toBe(150_000);
    });

    it('sets editor pay to 0 when no editor is assigned', async () => {
      const job = makeJob({ editor: null, status: 'COMPLETED' });
      const useCase = new GetPaymentsUseCase(makeRepo([job]));

      const { jobs } = await useCase.execute();

      expect(jobs[0].editorPay).toBe(0);
    });
  });

  describe('per-job total', () => {
    it('sums reporter pay and editor pay into totalPay', async () => {
      const reporter = makeReporter({ ratePerMinute: 2000 });
      const editor   = makeEditor({ flatFee: 150_000 });
      const job = makeJob({ duration: 60, reporter, editor, status: 'COMPLETED' });
      const useCase = new GetPaymentsUseCase(makeRepo([job]));

      const { jobs } = await useCase.execute();

      expect(jobs[0].totalPay).toBe(270_000); // 120_000 + 150_000
    });

    it('includes job details (caseName, duration, names) in each breakdown row', async () => {
      const reporter = makeReporter({ name: 'Alice' });
      const editor   = makeEditor({ name: 'Bob' });
      const job = makeJob({ caseName: 'Smith vs. Jones', duration: 45, reporter, editor, status: 'COMPLETED' });
      const useCase = new GetPaymentsUseCase(makeRepo([job]));

      const { jobs } = await useCase.execute();

      expect(jobs[0]).toMatchObject({
        caseName: 'Smith vs. Jones',
        duration: 45,
        reporterName: 'Alice',
        editorName: 'Bob',
      });
    });
  });

  describe('grand totals', () => {
    it('aggregates reporter pay, editor pay, and total across all jobs', async () => {
      const reporter = makeReporter({ ratePerMinute: 2000 });
      const editor   = makeEditor({ flatFee: 100_000 });

      const jobs = [
        makeJob({ id: 1, duration: 60, reporter, editor, status: 'COMPLETED' }),  // 120k + 100k
        makeJob({ id: 2, duration: 30, reporter, editor, status: 'REVIEWED'  }),  //  60k + 100k
      ];
      const useCase = new GetPaymentsUseCase(makeRepo(jobs));

      const { totals } = await useCase.execute();

      expect(totals.reporterPay).toBe(180_000);
      expect(totals.editorPay).toBe(200_000);
      expect(totals.total).toBe(380_000);
    });

    it('returns zero totals when no qualifying jobs exist', async () => {
      const useCase = new GetPaymentsUseCase(makeRepo([]));

      const { totals } = await useCase.execute();

      expect(totals).toEqual({ reporterPay: 0, editorPay: 0, total: 0 });
    });
  });

  describe('job eligibility', () => {
    it('only includes REVIEWED and COMPLETED jobs', async () => {
      const repo = makeRepo();
      const useCase = new GetPaymentsUseCase(repo);

      await useCase.execute();

      expect(repo.findByStatuses).toHaveBeenCalledWith(['REVIEWED', 'COMPLETED']);
    });

    it('returns empty list when repository returns no jobs', async () => {
      const useCase = new GetPaymentsUseCase(makeRepo([]));

      const { jobs } = await useCase.execute();

      expect(jobs).toHaveLength(0);
    });
  });
});
