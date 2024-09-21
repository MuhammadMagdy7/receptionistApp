// app/api/people/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Person from '@/models/Person';

export async function GET() {
  try {
    await connectToDatabase();
    const people = await Person.find().populate('organization').sort({ name: 1 });
    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, title, organization } = await request.json();
    await connectToDatabase();
    const newPerson = await Person.create({ name, title, organization });
    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
  }
}