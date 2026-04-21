import Link from 'next/link';

export default function Home() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
        Welcome
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
        The Fly Bottle registration platform for academic circles and seminars.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/admin/login" className="btn-secondary">
          Admin Portal
        </Link>
      </div>
    </div>
  );
}
