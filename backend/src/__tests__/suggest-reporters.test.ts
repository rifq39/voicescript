import { SuggestReportersUseCase } from '../application/use-cases/reporter/suggest-reporters.use-case';
import { JobRepository } from '../domain/repositories/job.repository';
import { ReporterRepository } from '../domain/repositories/reporter.repository';
import { makeJob, makeReporter } from './fixtures';

function makeRepos(jobOverrides = {}) {
  const job = makeJob(jobOverrides);

  const jobRepo: jest.Mocked<JobRepository> = {
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(job),
    findByStatuses: jest.fn(),
    create: jest.fn(),
    assignReporter: jest.fn(),
    assignEditor: jest.fn(),
    updateStatus: jest.fn(),
  };

  const reporterRepo: jest.Mocked<ReporterRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findAvailable: jest.fn(),
  };

  return { jobRepo, reporterRepo, job };
}

describe('SuggestReportersUseCase', () => {
  describe('physical job — city preference', () => {
    it('ranks same-city reporters first', async () => {
      const { jobRepo, reporterRepo } = makeRepos({ locationType: 'physical', city: 'Jakarta' });

      const alice = makeReporter({ id: 1, name: 'Alice', city: 'Bandung' });
      const bob   = makeReporter({ id: 2, name: 'Bob',   city: 'Jakarta' });
      const carol = makeReporter({ id: 3, name: 'Carol', city: 'Surabaya' });
      reporterRepo.findAvailable.mockResolvedValue([alice, carol, bob]);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);
      const result = await useCase.execute(1);

      expect(result[0].id).toBe(bob.id);
    });

    it('returns multiple same-city reporters before out-of-city ones', async () => {
      const { jobRepo, reporterRepo } = makeRepos({ locationType: 'physical', city: 'Jakarta' });

      const alice = makeReporter({ id: 1, name: 'Alice', city: 'Jakarta' });
      const bob   = makeReporter({ id: 2, name: 'Bob',   city: 'Jakarta' });
      const carol = makeReporter({ id: 3, name: 'Carol', city: 'Bandung' });
      reporterRepo.findAvailable.mockResolvedValue([carol, bob, alice]);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);
      const result = await useCase.execute(1);

      expect(result.slice(0, 2).map((r) => r.id).sort()).toEqual([alice.id, bob.id].sort());
      expect(result[2].id).toBe(carol.id);
    });

    it('sorts alphabetically within same-city reporters', async () => {
      const { jobRepo, reporterRepo } = makeRepos({ locationType: 'physical', city: 'Jakarta' });

      const zara  = makeReporter({ id: 1, name: 'Zara',  city: 'Jakarta' });
      const alice = makeReporter({ id: 2, name: 'Alice', city: 'Jakarta' });
      reporterRepo.findAvailable.mockResolvedValue([zara, alice]);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);
      const result = await useCase.execute(1);

      expect(result.map((r) => r.name)).toEqual(['Alice', 'Zara']);
    });

    it('sorts alphabetically within out-of-city reporters', async () => {
      const { jobRepo, reporterRepo } = makeRepos({ locationType: 'physical', city: 'Jakarta' });

      const zara  = makeReporter({ id: 1, name: 'Zara',  city: 'Bandung' });
      const alice = makeReporter({ id: 2, name: 'Alice', city: 'Surabaya' });
      reporterRepo.findAvailable.mockResolvedValue([zara, alice]);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);
      const result = await useCase.execute(1);

      expect(result.map((r) => r.name)).toEqual(['Alice', 'Zara']);
    });

    it('is case-insensitive when comparing cities', async () => {
      const { jobRepo, reporterRepo } = makeRepos({ locationType: 'physical', city: 'jakarta' });

      const alice = makeReporter({ id: 1, name: 'Alice', city: 'JAKARTA' });
      const bob   = makeReporter({ id: 2, name: 'Bob',   city: 'Bandung' });
      reporterRepo.findAvailable.mockResolvedValue([bob, alice]);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);
      const result = await useCase.execute(1);

      expect(result[0].id).toBe(alice.id);
    });
  });

  describe('remote job — no city preference', () => {
    it('returns all available reporters sorted alphabetically', async () => {
      const { jobRepo, reporterRepo } = makeRepos({ locationType: 'remote', city: null });

      const zara  = makeReporter({ id: 1, name: 'Zara',  city: 'Medan' });
      const alice = makeReporter({ id: 2, name: 'Alice', city: 'Jakarta' });
      const bob   = makeReporter({ id: 3, name: 'Bob',   city: 'Surabaya' });
      reporterRepo.findAvailable.mockResolvedValue([zara, alice, bob]);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);
      const result = await useCase.execute(1);

      expect(result.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Zara']);
    });
  });

  describe('edge cases', () => {
    it('returns empty list when no reporters are available', async () => {
      const { jobRepo, reporterRepo } = makeRepos();
      reporterRepo.findAvailable.mockResolvedValue([]);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);
      const result = await useCase.execute(1);

      expect(result).toEqual([]);
    });

    it('throws when job does not exist', async () => {
      const { jobRepo, reporterRepo } = makeRepos();
      jobRepo.findById.mockResolvedValue(null);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);

      await expect(useCase.execute(999)).rejects.toThrow('Job not found');
    });

    it('returns only available reporters (repository contract)', async () => {
      const { jobRepo, reporterRepo } = makeRepos({ locationType: 'remote', city: null });

      const alice = makeReporter({ id: 1, name: 'Alice', available: true });
      reporterRepo.findAvailable.mockResolvedValue([alice]);

      const useCase = new SuggestReportersUseCase(jobRepo, reporterRepo);
      const result = await useCase.execute(1);

      expect(result).toHaveLength(1);
      expect(result[0].available).toBe(true);
    });
  });
});
