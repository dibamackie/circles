"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CircleDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [circle, setCircle] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [telegramLink, setTelegramLink] = useState('');
  const [capacityInput, setCapacityInput] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/circles/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setCircle(data.circle);
      setSubmissions(data.submissions);
      setTelegramLink(data.circle.telegramLink || '');
      setCapacityInput(data.circle.capacity || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/circles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramLink })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSuccess(data.message || 'Telegram link updated successfully.');
      fetchData(); // refresh to show updated notified statuses
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdateLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/circles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setCircle({ ...circle, status: newStatus });
      setSuccess(`Status updated to ${newStatus}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCapacityUpdate = async () => {
    let parsedCapacity = parseInt(capacityInput, 10);
    if (isNaN(parsedCapacity) || parsedCapacity < 0) parsedCapacity = 0;
    
    if (parsedCapacity === circle.capacity) {
      setCapacityInput(parsedCapacity);
      return;
    }

    setUpdateLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/circles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity: parsedCapacity })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setCircle({ ...circle, capacity: parsedCapacity });
      setCapacityInput(parsedCapacity);
      setSuccess(`Capacity updated to ${parsedCapacity === 0 ? 'Unlimited' : parsedCapacity}.`);
    } catch (err) {
      setError(err.message);
      setCapacityInput(circle.capacity); // Revert on error
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading circle...</div>;
  if (!circle) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Circle not found</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{circle.name}</h2>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
            <span>Slug: /{circle.slug}</span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Status: 
              <select 
                value={circle.status} 
                onChange={handleStatusChange} 
                className="form-control" 
                style={{ marginLeft: '0.5rem', padding: '0.2rem 1rem 0.2rem 0.5rem', height: 'auto', background: 'transparent', color: 'var(--accent-primary)', fontWeight: 'bold' }}
                disabled={updateLoading}
              >
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="closed">closed</option>
              </select>
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Capacity (0=Unl): 
              <input 
                type="number"
                min="0"
                value={capacityInput} 
                onChange={(e) => setCapacityInput(e.target.value)}
                onBlur={handleCapacityUpdate}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCapacityUpdate(); }}
                className="form-control" 
                style={{ marginLeft: '0.5rem', width: '80px', padding: '0.2rem 0.5rem', height: 'auto', background: 'transparent', color: 'var(--accent-primary)', fontWeight: 'bold' }}
                disabled={updateLoading}
                title="Enter 0 for Unlimited"
              />
            </span>
          </div>
        </div>
        <Link href="/admin/dashboard" className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
          Back to Dashboard
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Telegram Invitation Configuration</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          When you add or update the Telegram invite link, the system will automatically send an invitation email to all existing registered users who have not yet received one.
        </p>
        
        <form onSubmit={handleUpdateLink} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Telegram Group Link</label>
            <input 
              type="url" className="form-control" 
              value={telegramLink} onChange={(e) => setTelegramLink(e.target.value)}
              placeholder="https://t.me/+joinlink"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={updateLoading}>
            {updateLoading ? 'Updating & Sending Emails...' : 'Save & Send Invites'}
          </button>
        </form>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem' }}>Registered Submissions ({submissions.length})</h3>
        {submissions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No submissions for this circle yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Education</th>
                  <th>Field</th>
                  <th>Notified (TG)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub._id}>
                    <td>{sub.fullName}</td>
                    <td>{sub.email}</td>
                    <td>{sub.country}</td>
                    <td>{sub.educationLevel}</td>
                    <td>{sub.fieldOfStudy}</td>
                    <td>
                      {sub.notified ? (
                        <span className="status-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>Sent</span>
                      ) : (
                        <span className="status-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>Pending</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

