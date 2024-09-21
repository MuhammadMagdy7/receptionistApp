// app/api/search/route.js
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

    const people = await Person.find({ 
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { title: { $regex: term, $options: 'i' } }
      ]
    }).populate('organization').limit(5);

    const organizations = await Organization.find({ 
      name: { $regex: term, $options: 'i' } 
    }).limit(5);

    const results = [
      ...people.map(p => ({ ...p.toObject(), type: 'person' })),
      ...organizations.map(o => ({ ...o.toObject(), type: 'organization' }))
    ];

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while searching' }, { status: 500 });
  }
}