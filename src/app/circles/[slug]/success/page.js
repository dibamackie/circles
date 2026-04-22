"use client";
import Link from 'next/link';
import { use } from 'react';

export default function SuccessPage({ params }) {
    const { slug } = use(params);

    return (
        <div className="card animate-fade-in text-center" style={{ maxWidth: '600px', margin: '4rem auto' }}>
            <div className="motif-circle-large"></div>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>🎉</div>
            
            <h2 className="font-serif" style={{ color: 'var(--success)', marginBottom: '1.5rem', fontSize: '2rem', position: 'relative', zIndex: 1 }}>
                Registration Successful
            </h2>
            
            <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Your registration has been received successfully.
                    We will be in contact with you soon with further details.
                </p>
                
                <p className="dir-rtl" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    ثبت‌نام شما با موفقیت انجام شد. 
                    به زودی اطلاعات تکمیلی برای شما ارسال خواهد شد.
                </p>
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Link href="/circles" className="btn-primary w-full" style={{ padding: '1rem', fontSize: '1.05rem' }}>
                    Return to Circles
                </Link>
            </div>
        </div>
    );
}

