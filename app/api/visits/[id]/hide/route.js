// app/api/visits/hide/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Visit from '@/models/Visit';

export async function PATCH(request, { params }) {
  const { id } = params;
  try {
    await connectToDatabase();
    const updatedVisit = await Visit.findByIdAndUpdate(id, { isHidden: true }, { new: true });

    if (updatedVisit) {
      return NextResponse.json(updatedVisit);
    }

    return NextResponse.json({ error: 'الزيارة غير موجودة.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء إخفاء الزيارة.' }, { status: 500 });
  }
}