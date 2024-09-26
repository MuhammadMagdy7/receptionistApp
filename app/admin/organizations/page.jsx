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
        if (response.ok) toast.success('تم الحذف بنجاح');
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
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">قائمة الجهات</h1>
      <Link href="/admin/add-organization" className="bg-primary text-white p-3 rounded hover:bg-primaryHover mb-4 inline-block">
        إضافة جهة جديدة
      </Link>
      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 border-b">اسم الجهة</th>
            <th className="py-3 px-4 border-b">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org._id} className="text-center hover:bg-gray-100 transition">
              <td className="border px-4 py-2">{org.name}</td>
              <td className="border flex gap-2 justify-center py-2">
                <Link href={`/admin/edit-organization/${org._id}`} className="bg-secondary text-white p-2 rounded hover:bg-secondaryHover mr-2">
                  تعديل
                </Link>
                <button onClick={() => handleDelete(org._id)} className="bg-danger text-white p-2 rounded hover:bg-dangerHover">
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}