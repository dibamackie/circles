"use client";

import { useEffect, useState, use } from 'react';
import { SUBJECTS } from '@/lib/constants';

export default function RegistrationForm({ params }) {
  const { slug } = use(params);
  const [circle, setCircle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    educationLevel: '',
    fieldOfStudy: '',
    interestedSubjects: [],
    agreedToCodeOfConduct: false,
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCircle();
  }, [slug]);

  const fetchCircle = async () => {
    try {
      const res = await fetch(`/api/circles/${slug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCircle(data.circle);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      const list = [...prev.interestedSubjects];
      if (list.includes(value)) {
        return { ...prev, interestedSubjects: list.filter(item => item !== value) };
      } else {
        return { ...prev, interestedSubjects: [...list, value] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');

    try {
      const payload = {
        ...formData,
        circleId: circle._id
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading registration form...</div>;
  if (error) return (
    <div className="container" style={{ marginTop: '4rem', maxWidth: '600px' }}>
      <div className="alert alert-error">
        <h3>Cannot Access Form</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  if (success) return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>ðŸŽ‰</div>
      <h2 style={{ color: 'var(--success)' }}>Registration Successful</h2>
      <p style={{ color: 'var(--text-secondary)', margin: '1.5rem 0' }}>
        Thank you for registering for <strong>{circle.name}</strong>. 
        We have sent a confirmation email to your address.
      </p>
    </div>
  );

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{circle.name}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Please fill out the form below to register.</p>
      </div>

      {submitError && <div className="alert alert-error">{submitError}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" className="form-control" 
              value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" className="form-control" 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Country of Residence</label>
            <input 
              type="text" className="form-control" 
              value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label>Level of Education</label>
            <input 
              type="text" className="form-control" placeholder="e.g. Bachelor's, Master's"
              value={formData.educationLevel} onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label>Field of Study</label>
            <input 
              type="text" className="form-control" 
              value={formData.fieldOfStudy} onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label>Interested Subjects (Select multiple by holding Ctrl/Cmd)</label>
          <select 
            multiple 
            className="form-control" 
            style={{ height: '200px' }}
            onChange={handleSubjectChange}
            required
            value={formData.interestedSubjects}
          >
            {SUBJECTS.map((subject, idx) => (
               <option key={idx} value={subject}>{subject}</option>
            ))}
          </select>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
             Selected: {formData.interestedSubjects.length} subject(s)
          </p>
        </div>

        <div className="form-group checkbox-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <input 
            type="checkbox" id="conductCheckbox"
            checked={formData.agreedToCodeOfConduct} 
            onChange={(e) => setFormData({...formData, agreedToCodeOfConduct: e.target.checked})}
            required
          />
          <label htmlFor="conductCheckbox">
             I agree to The Fly Bottle circle code of conduct.
          </label>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={submitLoading}>
          {submitLoading ? 'Submitting Registration...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}
