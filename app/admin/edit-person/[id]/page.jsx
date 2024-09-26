// app/admin/edit-person/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AccessDenied from '@/components/AccessDenied';

export default function EditPersonPage({ params }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (session?.user.role === 'receptionist') {
      fetchPerson();
      fetchOrganizations();
    }
  }, [session, id]);

  const fetchPerson = async () => {
    try {
      const response = await fetch(`/api/people/${id}`);
      if (!response.ok) throw new Error('Failed to fetch person');
      const data = await response.json();
      setName(data.name);
      setTitle(data.title);
      setOrganizationId(data.organization._id);
    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات الشخص');
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations');
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات الجهات');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/people/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title, organization: organizationId }),
      });

      if (!response.ok) throw new Error('Failed to update person');

      alert('تم تحديث الشخص بنجاح');
      router.push('/admin/people');
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الشخص');
    }
  };

  if (status === 'loading') return <p>جاري التحميل...</p>;
  if (!session || session.user.role !== 'receptionist') {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">تعديل الشخص</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="الصفة"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <select
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        >
          <option value="">اختر الجهة</option>
          {organizations.map(org => (
            <option key={org._id} value={org._id}>{org.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          تحديث الشخص
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}