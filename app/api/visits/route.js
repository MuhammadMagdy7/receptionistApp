// app/api/visits/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Visit from '@/models/Visit';

export async function GET() {
  try {
    await connectToDatabase();
    const visits = await Visit.find().sort({ createdAt: -1 });
    return NextResponse.json(visits);
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الزيارات.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { visitorName, visitorTitle, visitorOrganization, visitPurpose } = await request.json();
    await connectToDatabase();
    const newVisit = await Visit.create({ 
      visitorName, 
      visitorTitle, 
      visitorOrganization, 
      visitPurpose 
    });
    
    // هنا يمكنك إضافة كود لإرسال حدث Socket.io إذا كنت تستخدمه

    return NextResponse.json(newVisit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة الزيارة.' }, { status: 500 });
  }
}