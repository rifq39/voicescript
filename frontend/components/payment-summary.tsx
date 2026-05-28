'use client';

import { useEffect, useState } from 'react';
import { getPayments, PaymentSummary as Summary } from '@/lib/api';

function idr(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 700,
  color: '#6b7280',
  textTransform: 'uppercase',
  borderBottom: '2px solid #e5e7eb',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 14,
  borderBottom: '1px solid #f3f4f6',
};

const tdNumStyle: React.CSSProperties = {
  ...tdStyle,
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
};

export default function PaymentSummary() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments().then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <p style={{ color: '#6b7280' }}>Loading payments…</p>;
  if (!data || data.jobs.length === 0) return <p style={{ color: '#6b7280' }}>No completed or reviewed jobs yet.</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            <th style={thStyle}>Case</th>
            <th style={thStyle}>Reporter</th>
            <th style={thStyle}>Editor</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Duration</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Reporter Pay</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Editor Pay</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.jobs.map((job) => (
            <tr key={job.id}>
              <td style={tdStyle}>{job.caseName}</td>
              <td style={tdStyle}>{job.reporter?.name ?? '—'}</td>
              <td style={tdStyle}>{job.editor?.name ?? '—'}</td>
              <td style={tdNumStyle}>{job.duration} min</td>
              <td style={tdNumStyle}>{idr(job.reporterPay)}</td>
              <td style={tdNumStyle}>{idr(job.editorPay)}</td>
              <td style={{ ...tdNumStyle, fontWeight: 700 }}>{idr(job.totalPay)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot style={{ background: '#f0fdf4' }}>
          <tr>
            <td colSpan={4} style={{ ...tdStyle, fontWeight: 700 }}>Grand Total</td>
            <td style={{ ...tdNumStyle, fontWeight: 700, color: '#166534' }}>{idr(data.totals.reporterPay)}</td>
            <td style={{ ...tdNumStyle, fontWeight: 700, color: '#166534' }}>{idr(data.totals.editorPay)}</td>
            <td style={{ ...tdNumStyle, fontWeight: 800, color: '#166534', fontSize: 15 }}>{idr(data.totals.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
