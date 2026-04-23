import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/mockDB';
import { sendConfirmationEmail, sendTelegramInviteEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.interestedSubjects || data.interestedSubjects.length === 0) {
      return NextResponse.json({ error: 'Please select at least one interested subject.' }, { status: 400 });
    }
    if (!data.agreedToCodeOfConduct) {
        return NextResponse.json({ error: 'You must agree to the code of conduct.' }, { status: 400 });
    }

    const db = getDB();
    const circle = db.circles.find(c => c._id === data.circleId);
    
    if (!circle) return NextResponse.json({ error: 'Circle does not exist.' }, { status: 400 });

    if (circle.capacity > 0) {
        const count = db.submissions.filter(s => s.circleId === circle._id).length;
        if (count >= circle.capacity) {
            return NextResponse.json({ error: 'Registration capacity has been reached.' }, { status: 400 });
        }
    }

    const newSubmission = {
      _id: Date.now().toString(),
      ...data,
      notified: false,
      createdAt: new Date().toISOString()
    };

    const circleName = circle.titleEn || circle.name;

    // If telegram link already exists, send invite immediately
    if (circle.telegramLink) {
        await sendTelegramInviteEmail(data.email, data.fullName, circleName, circle.telegramLink);
        newSubmission.notified = true;
    }

    db.submissions.push(newSubmission);
    
    // Auto-close circle if capacity is reached
    if (circle.capacity > 0) {
        const newCount = db.submissions.filter(s => s.circleId === circle._id).length;
        if (newCount >= circle.capacity) {
            circle.status = 'closed';
        }
    }

    saveDB(db);

    return NextResponse.json({ success: true, message: 'Registration received successfully.' });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
