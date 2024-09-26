// app/api/search/people/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Person from '@/models/Person';
import Organization from '@/models/Organization';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // أولاً، ابحث عن المنظمات التي تطابق مصطلح البحث
    const organizations = await Organization.find({ 
      name: { $regex: term, $options: 'i' } 
    });

    // استخرج معرفات المنظمات
    const organizationIds = organizations.map(org => org._id);

    // الآن ابحث عن الأشخاص
    const people = await Person.find({ 
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { title: { $regex: term, $options: 'i' } },
        { organization: { $in: organizationIds } } // ابحث عن الأشخاص المنتمين للمنظمات التي تم العثور عليها
      ]
    }).populate('organization').limit(5);

    return NextResponse.json(people);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'An error occurred while searching' }, { status: 500 });
  }
}