import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'mockDB.json');

export function getDB() {
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      circles: [
        { 
          _id: '1', 
          slug: 'phil-ai-26',
          titleEn: 'Philosophy in AI', 
          titleFa: 'فلسفه در هوش مصنوعی',
          descriptionEn: 'Discussing the fundamental problems of intelligence, consciousness, and ethics in modern AI architectures.',
          descriptionFa: 'بحث درباره مشکلات اساسی هوش، آگاهی و اخلاق در معماریهای مدرن هوش مصنوعی.',
          status: 'open', 
          capacity: 20, 
        },
        { 
          _id: '2', 
          slug: 'hist-science',
          titleEn: 'Advanced History of Science', 
          titleFa: 'تاریخ پیشرفته علم',
          descriptionEn: 'A deep dive into paradigm shifts and the scientific revolutions from the 16th century to modern quantum mechanics.',
          descriptionFa: 'نگاهی عمیق به تغییر پارادایمها و انقلابهای علمی از قرن ۱۶ تا مکانیک کوانتومی مدرن.',
          status: 'closed', 
          capacity: 15,
        },
        { 
          _id: '3', 
          slug: 'public-health-seminar',
          titleEn: 'Public Health & Society', 
          titleFa: 'بهداشت عمومی و جامعه',
          descriptionEn: 'Exploring the intersection of sociology, politics, and public health policies.',
          descriptionFa: 'بررسی تقاطع جامعه‌شناسی، سیاست و سیاست‌های بهداشت عمومی.',
          status: 'open', 
          capacity: 2, // Low capacity to test full state
        }
      ],
      submissions: [
         { _id: 's1', circleId: '1', fullName: 'Jane Doe', email: 'jane@example.com', country: 'Canada', educationLevel: 'PhD', fieldOfStudy: 'Philosophy', interestedSubjects: ['فلسفه Philosophy'], notified: false, createdAt: new Date() },
         { _id: 's2', circleId: '3', fullName: 'Test User', email: 'test@example.com', country: 'UK', educationLevel: 'BSc', fieldOfStudy: 'Sociology', interestedSubjects: ['جامعهشناسی Sociology'], notified: false, createdAt: new Date() }
      ]
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

export function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
