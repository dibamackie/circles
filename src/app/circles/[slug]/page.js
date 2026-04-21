"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { SUBJECTS } from '@/lib/constants';
import Link from 'next/link';

export default function RegistrationForm({ params }) {
  const { slug } = use(params);
  const router = useRouter();
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
      
      // Redirect to success page
      router.push(`/circles/${slug}/success`);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitLoading(false); // only disable loading if error
    } 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading form... / Ø¯Ø± Ø­Ø§Ù„ Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±ÛŒ...</div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-50 text-red-800 p-6 rounded-lg max-w-lg shadow-sm border border-red-200">
        <h3 className="font-bold text-lg mb-2">Error</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  const isFull = circle.capacityLimit > 0 && circle.currentRegistrations >= circle.capacityLimit;
  const isClosed = circle.status === 'closed';
  const isLocked = isFull || isClosed;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/circles" className="text-gray-500 hover:text-black mb-8 inline-block text-sm font-medium transition-colors">
          &larr; Back to Circles
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-start mb-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest ${
                        isLocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {isClosed ? 'Closed / Ø¨Ø³ØªÙ‡' : isFull ? 'Full / ØªÚ©Ù…ÛŒÙ„' : 'Open / Ø¨Ø§Ø²'}
                    </span>
                    <span className="text-sm font-medium text-gray-500 bg-white px-4 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        {circle.capacityLimit > 0 ? `${circle.currentRegistrations} / ${circle.capacityLimit} Capacity` : `${circle.currentRegistrations} Registrations`}
                    </span>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{circle.titleEn || circle.name}</h1>
                <h2 className="text-2xl font-bold text-gray-500 mb-6" dir="rtl">{circle.titleFa}</h2>
                
                <p className="text-gray-700 leading-relaxed mb-4">{circle.descriptionEn}</p>
                <p className="text-gray-700 leading-relaxed text-right dir-rtl" dir="rtl">{circle.descriptionFa}</p>
            </div>

            <div className="p-8">
                {isLocked ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-4xl mb-4">ðŸ”’</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Capacity is full / This circle is closed</h3>
                        <h4 className="text-lg text-gray-600 dir-rtl" dir="rtl">Ø¸Ø±ÙÛŒØª ØªÚ©Ù…ÛŒÙ„ Ø§Ø³Øª / Ø§ÛŒÙ† Ø­Ù„Ù‚Ù‡ Ø¨Ø³ØªÙ‡ Ø´Ø¯Ù‡ Ø§Ø³Øª</h4>
                        <p className="mt-4 text-sm text-gray-500">Registration is no longer available for this circle.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {submitError && (
                            <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
                                {submitError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-shadow" 
                                    value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-shadow" 
                                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Country of Residence <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-shadow" 
                                    value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Level of Education <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-shadow" placeholder="e.g. Master's" 
                                    value={formData.educationLevel} onChange={(e) => setFormData({...formData, educationLevel: e.target.value})} required 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Field of Study <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-shadow" 
                                    value={formData.fieldOfStudy} onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})} required 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Subjects of Interest <span className="text-red-500">*</span></label>
                            <p className="text-xs text-gray-500 mb-4">Select multiple subjects (Hold Ctrl/Cmd)</p>
                            <select multiple className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-shadow"
                                onChange={handleSubjectChange} required value={formData.interestedSubjects}
                            >
                                {SUBJECTS.map((subject, idx) => (
                                    <option key={idx} value={subject} className="py-1">{subject}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <label className="flex items-start gap-4 cursor-pointer">
                                <input type="checkbox" className="w-6 h-6 mt-1 rounded border-gray-300 text-black focus:ring-black"
                                    checked={formData.agreedToCodeOfConduct} 
                                    onChange={(e) => setFormData({...formData, agreedToCodeOfConduct: e.target.checked})} required
                                />
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm text-gray-800">
                                        I have read and agree to the <a href="https://theflybottle.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors">Fly Bottle Circle Code of Conduct</a>
                                    </span>
                                    <span className="text-sm text-gray-800 dir-rtl text-right" dir="rtl">
                                        Ù…Ù† <a href="https://theflybottle.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors">Ø¢ÛŒÛŒÙ†â€ŒÙ†Ø§Ù…Ù‡ Ø±ÙØªØ§Ø±ÛŒ Ø­Ù„Ù‚Ù‡â€ŒÙ‡Ø§ÛŒ Ù…Ú¯Ø³ Ø¯Ø± Ø¨Ø·Ø±ÛŒ</a> Ø±Ø§ Ø®ÙˆØ§Ù†Ø¯Ù‡â€ŒØ§Ù… Ùˆ Ø¨Ø§ Ø¢Ù† Ù…ÙˆØ§ÙÙ‚Ù…
                                    </span>
                                </div>
                            </label>
                        </div>

                        <button type="submit" className={`w-full py-4 rounded-xl text-lg font-bold text-white transition-all shadow-md ${submitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 hover:shadow-lg'}`} disabled={submitLoading}>
                            {submitLoading ? 'Submitting... / Ø¯Ø± Ø­Ø§Ù„ Ø§Ø±Ø³Ø§Ù„...' : 'Complete Registration / ØªÚ©Ù…ÛŒÙ„ Ø«Ø¨Øªâ€ŒÙ†Ø§Ù…'}
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

