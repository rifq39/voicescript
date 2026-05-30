export interface Reporter {
  id: number;
  name: string;
  city: string;
  available: boolean;
  ratePerMinute: number;
  jobs?: { id: number; status: string }[];
}

export interface Editor {
  id: number;
  name: string;
  available: boolean;
  flatFee: number;
  jobs?: { id: number; status: string }[];
}

export type JobStatus = 'NEW' | 'ASSIGNED' | 'TRANSCRIBED' | 'REVIEWED' | 'COMPLETED';

export interface Job {
  id: number;
  caseName: string;
  duration: number;
  locationType: 'physical' | 'remote';
  city: string | null;
  status: JobStatus;
  reporterId: number | null;
  editorId: number | null;
  reporter: Reporter | null;
  editor: Editor | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentJob extends Job {
  reporterPay: number;
  editorPay: number;
  totalPay: number;
}

export interface PaymentSummary {
  jobs: PaymentJob[];
  totals: { reporterPay: number; editorPay: number; total: number };
}
