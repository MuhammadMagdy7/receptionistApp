// app/api/organizations/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Organization from '@/models/Organization';

export async function GET() {
  try {
    await connectToDatabase();
    const organizations = await Organization.find().sort({ name: 1 });
    return NextResponse.json(organizations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    await connectToDatabase();
    const newOrganization = await Organization.create({ name });
    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}