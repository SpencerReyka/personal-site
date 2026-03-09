export const metadata = { title: 'claude-mobile' };

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0f0f0f', overflow: 'hidden' }}>
      {children}
    </div>
  );
}
