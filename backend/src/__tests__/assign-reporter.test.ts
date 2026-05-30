import { AssignReporterUseCase } from '../application/use-cases/job/assign-reporter.use-case';
import { JobRepository } from '../domain/repositories/job.repository';
import { ReporterRepository } from '../domain/repositories/reporter.repository';
import { makeJob, makeReporter } from './fixtures';

function makeRepos(jobOverrides = {}, reporterOverrides = {}) {
  const job = makeJob(jobOverrides);
  const reporter = makeReporter(reporterOverrides);

  const jobRepo: jest.Mocked<JobRepository> = {
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(job),
    findByStatuses: jest.fn(),
    create: jest.fn(),
    assignReporter: jest.fn().mockResolvedValue({ ...job, reporterId: reporter.id, status: 'ASSIGNED' }),
    assignEditor: jest.fn(),
    updateStatus: jest.fn(),
  };

  const reporterRepo: jest.Mocked<ReporterRepository> = {
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(reporter),
    findAvailable: jest.fn(),
  };

  return { jobRepo, reporterRepo, job, reporter };
}

describe('AssignReporterUseCase', () => {
  describe('successful assignment', () => {
    it('assigns a reporter to a NEW job and transitions status to ASSIGNED', async () => {
      const { jobRepo, reporterRepo, reporter } = makeRepos();
      const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);

      const result = await useCase.execute(1, reporter.id);

      expect(jobRepo.assignReporter).toHaveBeenCalledWith(1, reporter.id, 'ASSIGNED');
      expect(result.status).toBe('ASSIGNED');
      expect(result.reporterId).toBe(reporter.id);
    });

    it('assigns a same-city reporter to a physical job', async () => {
      const { jobRepo, reporterRepo, reporter } = makeRepos(
        { locationType: 'physical', city: 'Surabaya' },
        { city: 'Surabaya' },
      );
      const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);

      await useCase.execute(1, reporter.id);

      expect(jobRepo.assignReporter).toHaveBeenCalledWith(1, reporter.id, 'ASSIGNED');
    });

    it('assigns a reporter from a different city to a physical job (remote allowed)', async () => {
      const { jobRepo, reporterRepo, reporter } = makeRepos(
        { locationType: 'physical', city: 'Bandung' },
        { city: 'Jakarta' },
      );
      const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);

      await expect(useCase.execute(1, reporter.id)).resolves.toBeDefined();
    });

    it('assigns any available reporter to a remote job regardless of city', async () => {
      const { jobRepo, reporterRepo, reporter } = makeRepos(
        { locationType: 'remote', city: null },
        { city: 'Medan' },
      );
      const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);

      await expect(useCase.execute(1, reporter.id)).resolves.toBeDefined();
      expect(jobRepo.assignReporter).toHaveBeenCalledWith(1, reporter.id, 'ASSIGNED');
    });
  });

  describe('validation errors', () => {
    it('throws when job does not exist', async () => {
      const { jobRepo, reporterRepo } = makeRepos();
      jobRepo.findById.mockResolvedValue(null);
      const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);

      await expect(useCase.execute(999, 1)).rejects.toThrow('Job not found');
    });

    it('throws when job status is not NEW', async () => {
      const { jobRepo, reporterRepo } = makeRepos({ status: 'ASSIGNED' });
      const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);

      await expect(useCase.execute(1, 1)).rejects.toThrow('Can only assign reporter when status is NEW');
    });

    it('throws for each non-NEW status', async () => {
      const nonNewStatuses = ['TRANSCRIBED', 'REVIEWED', 'COMPLETED'] as const;

      for (const status of nonNewStatuses) {
        const { jobRepo, reporterRepo } = makeRepos({ status });
        const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);
        await expect(useCase.execute(1, 1)).rejects.toThrow('Can only assign reporter when status is NEW');
      }
    });

    it('throws when reporter does not exist', async () => {
      const { jobRepo, reporterRepo } = makeRepos();
      reporterRepo.findById.mockResolvedValue(null);
      const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);

      await expect(useCase.execute(1, 999)).rejects.toThrow('Reporter not found');
    });

    it('throws when reporter is not available', async () => {
      const { jobRepo, reporterRepo } = makeRepos({}, { available: false });
      const useCase = new AssignReporterUseCase(jobRepo, reporterRepo);

      await expect(useCase.execute(1, 1)).rejects.toThrow('Reporter is not available');
    });
  });
});
