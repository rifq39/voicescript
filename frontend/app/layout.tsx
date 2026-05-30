import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VoiceScript — Court Reporting Workflow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-900 text-white px-8 py-4">
          <div className="font-extrabold text-xl tracking-tight">VoiceScript</div>
          <div className="text-xs text-blue-200 mt-0.5">Court Reporting Workflow Manager</div>
        </header>
        {children}
      </body>
    </html>
  );
}
