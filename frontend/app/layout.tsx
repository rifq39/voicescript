import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VoiceScript — Court Reporting Workflow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc' }}>
        <header style={{ background: '#1e3a8a', color: '#fff', padding: '16px 32px' }}>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }}>VoiceScript</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Court Reporting Workflow Manager</div>
        </header>
        {children}
      </body>
    </html>
  );
}
