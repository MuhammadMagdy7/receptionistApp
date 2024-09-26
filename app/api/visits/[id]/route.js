// app/api/visits/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Visit from '@/models/Visit';

export async function PATCH(request, { params }) {
  const { id } = params;
  try {
    const { status } = await request.json();
    await connectToDatabase();
    const updatedVisit = await Visit.findByIdAndUpdate(id, { status }, { new: true });

    if (updatedVisit) {
      return NextResponse.json(updatedVisit);
    }

    return NextResponse.json({ error: 'الزيارة غير موجودة.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الزيارة.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const deletedVisit = await Visit.findByIdAndDelete(params.id);

    if (deletedVisit) {
      return NextResponse.json({ message: 'تم حذف الزيارة بنجاح.' });
    }

    return NextResponse.json({ error: 'الزيارة غير موجودة.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الزيارة.' }, { status: 500 });
  }
}