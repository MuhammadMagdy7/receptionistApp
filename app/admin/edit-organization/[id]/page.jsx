// app/admin/edit-organization/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AccessDenied from '@/components/AccessDenied';
import toast from 'react-hot-toast';

export default function EditOrganizationPage({ params }) {
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (session?.user.role === 'receptionist') {
      const fetchOrganization = async () => {
        try {
          const response = await fetch(`/api/organizations/${id}`);
          if (!response.ok) throw new Error('Failed to fetch organization');
          const data = await response.json();
          setOrganizationName(data.name);
        } catch (err) {
          setError('حدث خطأ أثناء جلب بيانات الجهة');
        }
      };

      fetchOrganization();
    }
  }, [session, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: organizationName }),
      });

      if (!response.ok) throw new Error('Failed to update organization');

      toast.success('تم تحديث الجهة بنجاح');
      router.push('/admin/organizations');
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الجهة');
    }
  };

  if (status === 'loading') return <p>جاري التحميل...</p>;
  if (!session || session.user.role !== 'receptionist') {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">تعديل الجهة</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <input
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="اسم الجهة"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button type="submit" className="w-full bg-primary text-white p-3 rounded hover:bg-primaryHover transition">
          تحديث الجهة
        </button>
      </form>
      {error && <p className="text-danger mt-4 text-center">{error}</p>}
    </div>
  );
}