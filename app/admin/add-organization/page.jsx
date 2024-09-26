// app/admin/add-organization/page.js
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AccessDenied from '@/components/AccessDenied';

export default function AddOrganizationPage() {
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <p>جاري التحميل...</p>;
  if (!session || session.user.role !== 'receptionist') {
    return <AccessDenied />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: organizationName }),
      });

      if (!response.ok) throw new Error('Failed to add organization');

      const data = await response.json();
      setOrganizationName('');
      alert('تمت إضافة الجهة بنجاح');
      router.push('/admin/organizations'); // افتراض وجود صفحة لعرض الجهات
    } catch (err) {
      setError('حدث خطأ أثناء إضافة الجهة');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">إضافة جهة عمل جديدة</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="اسم الجهة"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          إضافة الجهة
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}