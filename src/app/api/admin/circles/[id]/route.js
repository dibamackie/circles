import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDB, saveDB } from '@/lib/mockDB';
import { sendTelegramInviteEmail } from '@/lib/email';

export async function GET(req, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const db = getDB();
    
    const circle = db.circles.find(c => c._id === id);
    if (!circle) return NextResponse.json({ error: 'Circle not found' }, { status: 404 });

    const submissions = db.submissions.filter(s => s.circleId === id).reverse();
    
    return NextResponse.json({ success: true, circle, submissions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const data = await req.json();
    
    const db = getDB();
    const circleIndex = db.circles.findIndex(c => c._id === id);
    if (circleIndex === -1) return NextResponse.json({ error: 'Circle not found' }, { status: 404 });

    // Update fields
    const updatedCircle = { ...db.circles[circleIndex], ...data };
    
    // Auto-mark notifications and send emails if Telegram link is added for the first time
    if (data.telegramLink && !db.circles[circleIndex].telegramLink) {
        const emailPromises = [];

        db.submissions = db.submissions.map(sub => {
            if (sub.circleId === id && !sub.notified) {
                emailPromises.push(
                    sendTelegramInviteEmail(
                        sub.email,
                        sub.fullName,
                        updatedCircle.titleEn || updatedCircle.name,
                        data.telegramLink
                    )
                );
                return { ...sub, notified: true };
            }
            return sub;
        });

        await Promise.allSettled(emailPromises);
    }
    
    db.circles[circleIndex] = updatedCircle;
    saveDB(db);

    return NextResponse.json({ 
      success: true, 
      circle: updatedCircle, 
      message: 'Updated successfully (mocked).' 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    
    const db = getDB();
    const circleIndex = db.circles.findIndex(c => c._id === id);
    if (circleIndex === -1) return NextResponse.json({ error: 'Circle not found' }, { status: 404 });

    // Remove the circle
    db.circles.splice(circleIndex, 1);
    
    // Also remove associated submissions
    db.submissions = db.submissions.filter(sub => sub.circleId !== id);
    
    saveDB(db);

    return NextResponse.json({ success: true, message: 'Circle deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
