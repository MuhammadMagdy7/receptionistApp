// app/api/people/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Person from '@/models/Person';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const person = await Person.findById(params.id).populate('organization');
    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }
    return NextResponse.json(person);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch person' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, title, organization } = await request.json();
    await connectToDatabase();
    const updatedPerson = await Person.findByIdAndUpdate(
      params.id,
      { name, title, organization },
      { new: true, runValidators: true }
    ).populate('organization');
    if (!updatedPerson) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }
    return NextResponse.json(updatedPerson);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const deletedPerson = await Person.findByIdAndDelete(params.id);
    if (!deletedPerson) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Person deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}