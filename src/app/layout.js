import './globals.css';

export const metadata = {
  title: 'The Fly Bottle Circles',
  description: 'Premium Registration Platform for The Fly Bottle',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container" style={{ padding: '2rem' }}>
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>
              The Fly Bottle Circles
            </h1>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
