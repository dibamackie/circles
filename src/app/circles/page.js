"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CirclesList() {
    const [circles, setCircles] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/circles')
            .then(res => res.json())
            .then(data => {
                if(data.success) setCircles(data.circles);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading circles... / Ø¯Ø± Ø­Ø§Ù„ Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±ÛŒ...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Available Circles</h1>
                    <h2 className="text-2xl font-light text-gray-600 block dir-rtl">Ø­Ù„Ù‚Ù‡â€ŒÙ‡Ø§ÛŒ Ø¯Ø± Ø¯Ø³ØªØ±Ø³</h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {circles && circles.map(circle => {
                        const isFull = circle.capacityLimit > 0 && circle.currentRegistrations >= circle.capacityLimit;
                        const isClosed = circle.status === 'closed';
                        const locked = isFull || isClosed;

                        return (
                            <div key={circle._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-transform hover:-translate-y-1 duration-300">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            locked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {isClosed ? 'Closed / Ø¨Ø³ØªÙ‡' : isFull ? 'Full / ØªÚ©Ù…ÛŒÙ„' : 'Open / Ø¨Ø§Ø²'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{circle.titleEn || circle.name}</h3>
                                    <h4 className="text-lg font-medium text-gray-500 mb-4" dir="rtl">{circle.titleFa}</h4>
                                    
                                    <p className="text-gray-700 text-sm mb-3 font-light leading-relaxed">{circle.descriptionEn}</p>
                                    <p className="text-gray-700 text-sm mb-4 text-right font-light leading-relaxed" dir="rtl">{circle.descriptionFa}</p>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 font-semibold bg-white px-3 py-1 rounded-md border border-gray-200">
                                            {circle.capacityLimit > 0 ? `${circle.currentRegistrations} / ${circle.capacityLimit} spots` : `${circle.currentRegistrations} joined`}
                                        </span>
                                        <Link href={`/circles/${circle.slug}`} className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all ${locked ? 'bg-gray-300 cursor-not-allowed pointer-events-none' : 'bg-black hover:bg-gray-800 shadow-md hover:shadow-xl'}`}>
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

