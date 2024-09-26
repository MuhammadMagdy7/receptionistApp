// app/api/organizations/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Organization from '@/models/Organization';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const organization = await Organization.findById(params.id);
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { name } = await request.json();
    await connectToDatabase();
    const updatedOrganization = await Organization.findByIdAndUpdate(
      params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updatedOrganization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json(updatedOrganization);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const deletedOrganization = await Organization.findByIdAndDelete(params.id);
    if (!deletedOrganization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 });
  }
}