'use client';

import { usePayments } from '@/lib/hooks';
import {
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

function idr(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function PaymentSummary() {
  const { data, loading } = usePayments();

  if (loading) return <p className="text-sm text-muted-foreground">Loading payments…</p>;
  if (!data || data.jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">No completed or reviewed jobs yet.</p>;
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Case</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Editor</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="text-right">Reporter Pay</TableHead>
            <TableHead className="text-right">Editor Pay</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.caseName}</TableCell>
              <TableCell>{job.reporter?.name ?? '—'}</TableCell>
              <TableCell>{job.editor?.name ?? '—'}</TableCell>
              <TableCell className="text-right tabular-nums">{job.duration} min</TableCell>
              <TableCell className="text-right tabular-nums">{idr(job.reporterPay)}</TableCell>
              <TableCell className="text-right tabular-nums">{idr(job.editorPay)}</TableCell>
              <TableCell className="text-right tabular-nums font-semibold">{idr(job.totalPay)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-green-50">
          <TableRow>
            <TableCell colSpan={4} className="font-bold">Grand Total</TableCell>
            <TableCell className="text-right tabular-nums font-bold text-green-700">
              {idr(data.totals.reporterPay)}
            </TableCell>
            <TableCell className="text-right tabular-nums font-bold text-green-700">
              {idr(data.totals.editorPay)}
            </TableCell>
            <TableCell className="text-right tabular-nums font-extrabold text-green-700 text-base">
              {idr(data.totals.total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
