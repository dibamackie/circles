"use client";
import Link from 'next/link';
import { use } from 'react';

export default function SuccessPage({ params }) {
    const { slug } = use(params);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center animate-fade-in hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Success</h2>
                
                <div className="space-y-6 mb-8 text-gray-700 leading-relaxed font-light">
                    <p className="text-lg">
                        Your registration has been received successfully.
                        You will be contacted soon with further details.
                    </p>
                    
                    <div className="w-full h-px bg-gray-100"></div>
                    
                    <p className="text-lg dir-rtl" dir="rtl">
                        Ø«Ø¨Øªâ€ŒÙ†Ø§Ù… Ø´Ù…Ø§ Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø§Ù†Ø¬Ø§Ù… Ø´Ø¯. 
                        Ø¨Ù‡ Ø²ÙˆØ¯ÛŒ Ø§Ø·Ù„Ø§Ø¹Ø§Øª ØªÚ©Ù…ÛŒÙ„ÛŒ Ø¨Ø±Ø§ÛŒ Ø´Ù…Ø§ Ø§Ø±Ø³Ø§Ù„ Ø®ÙˆØ§Ù‡Ø¯ Ø´Ø¯.
                    </p>
                </div>
                
                <Link href="/circles" className="inline-block w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                    Return to Circles
                </Link>
            </div>
        </div>
    );
}

