"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCircles();
  }, []);

  const fetchCircles = async () => {
    try {
      const res = await fetch('/api/admin/circles');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCircles(data.circles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading dashboard...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-primary)' }}>Admin Dashboard</h2>
        <Link href="/admin/circles/new" className="btn-primary">
          + Create Circle
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem' }}>Active Circles</h3>
        {circles.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No circles created yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Telegram</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {circles.map(circle => (
                <tr key={circle._id} className={circle.telegramLink ? 'row-green' : ''}>
                  <td>{circle.name}</td>
                  <td>/{circle.slug}</td>
                  <td>
                    <span style={{ 
                      color: circle.status === 'active' ? 'var(--success)' : circle.status === 'closed' ? 'var(--danger)' : 'var(--text-secondary)' 
                    }}>
                      {circle.status}
                    </span>
                  </td>
                  <td>{circle.capacity === 0 ? 'Unlimited' : circle.capacity}</td>
                  <td>
                    {circle.telegramLink ? (
                      <span className="telegram-has">Added</span>
                    ) : (
                      <span className="telegram-none">None</span>
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/circles/${circle._id}`} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Inject specific dynamic styling for Telegram Rows */}
      <style dangerouslySetInnerHTML={{__html: `
        .row-green td {
          border-bottom: 1px solid rgba(16, 185, 129, 0.2) !important;
          background: rgba(16, 185, 129, 0.03);
        }
        .row-green:hover td {
          background: rgba(16, 185, 129, 0.08) !important;
        }
      `}} />
    </div>
  );
}

