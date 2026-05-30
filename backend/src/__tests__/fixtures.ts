import { Reporter } from '../domain/entities/reporter';
import { Editor } from '../domain/entities/editor';
import { Job } from '../domain/entities/job';

const NOW = new Date('2024-01-01T00:00:00Z');

export function makeReporter(overrides: Partial<Reporter> = {}): Reporter {
  return {
    id: 1,
    name: 'Alice',
    city: 'Jakarta',
    available: true,
    ratePerMinute: 5000,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

export function makeEditor(overrides: Partial<Editor> = {}): Editor {
  return {
    id: 1,
    name: 'Bob',
    available: true,
    flatFee: 150000,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

export function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: 1,
    caseName: 'Smith vs. Jones',
    duration: 60,
    locationType: 'physical',
    city: 'Jakarta',
    status: 'NEW',
    reporterId: null,
    editorId: null,
    reporter: null,
    editor: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}
