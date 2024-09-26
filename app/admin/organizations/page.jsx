// app/admin/organizations/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AccessDenied from '@/components/AccessDenied';
import toast from 'react-hot-toast';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user.role === 'receptionist') {
      fetchOrganizations();
    }
  }, [session]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations');
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات الجهات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الجهة؟')) {
      try {
        const response = await fetch(`/api/organizations/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) toast.success('تم الحذف بنجاح')
        if (!response.ok) throw new Error('Failed to delete organization');
        setOrganizations(organizations.filter(org => org._id !== id));
      } catch (err) {
        setError('حدث خطأ أثناء حذف الجهة');
      }
    }
  };

  if (status === 'loading') return <p>جاري التحميل...</p>;
  if (!session || session.user.role !== 'receptionist') {
    return <AccessDenied />;
  }

  if (isLoading) return <p>جاري تحميل البيانات...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">قائمة الجهات</h1>
      <Link href="/admin/add-organization" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4 inline-block">
        إضافة جهة جديدة
      </Link>
      <ul className="mt-4">
        {organizations.map((org) => (
          <li key={org._id} className="border p-2 mb-2 rounded flex justify-between items-center">
            <span><strong>اسم الجهة:</strong> {org.name}</span>
            <div>
              <Link href={`/admin/edit-organization/${org._id}`} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2">
                تعديل
              </Link>
              <button onClick={() => handleDelete(org._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}