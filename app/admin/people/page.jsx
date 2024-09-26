// app/admin/people/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AccessDenied from '@/components/AccessDenied';
import toast from 'react-hot-toast';

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user.role === 'receptionist') {
      fetchPeople();
      fetchOrganizations();
    }
  }, [session]);

  const fetchPeople = async () => {
    try {
      const response = await fetch('/api/people');
      if (!response.ok) throw new Error('Failed to fetch people');
      const data = await response.json();
      setPeople(data);
    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات الأشخاص');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations');
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات المنظمات');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الشخص؟')) {
      try {
        const response = await fetch(`/api/people/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) toast.success('تم الحذف بنجاح');
        if (!response.ok) throw new Error('Failed to delete person');
        setPeople(people.filter(person => person._id !== id));
      } catch (err) {
        setError('حدث خطأ أثناء حذف الشخص');
        toast.error('حدث خطأ أثناء حذف الشخص');
      }
    }
  };

  if (status === 'loading') return <p>جاري التحميل...</p>;
  if (!session || session.user.role !== 'receptionist') {
    return <AccessDenied />;
  }

  if (isLoading) return <p>جاري تحميل البيانات...</p>;
  if (error) return toast.error(error);

  const filteredPeople = selectedOrganizationId
    ? people.filter((person) => person.organization._id === selectedOrganizationId)
    : people;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">قائمة الأشخاص</h1>
      <Link href="/admin/add-person" className="bg-primary text-white p-3 rounded hover:bg-primaryHover mb-4 inline-block">
        إضافة شخص جديد
      </Link>
      <select
        value={selectedOrganizationId}
        onChange={(e) => setSelectedOrganizationId(e.target.value)}
        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">جميع الجهات</option>
        {organizations.map(org => (
          <option key={org._id} value={org._id}>{org.name}</option>
        ))}
      </select>
      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 border-b">الاسم</th>
            <th className="py-3 px-4 border-b">الصفة</th>
            <th className="py-3 px-4 border-b">الجهة</th>
            <th className="py-3 px-4 border-b">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredPeople.map((person) => (
            <tr key={person._id} className="text-center hover:bg-gray-100 transition">
              <td className="border px-4 py-2">{person.name}</td>
              <td className="border px-4 py-2">{person.title}</td>
              <td className="border px-4 py-2">{person.organization?.name}</td>
              <td className="border flex gap-2 justify-center py-2">
                <Link href={`/admin/edit-person/${person._id}`} className="bg-secondary text-white p-2 rounded hover:bg-secondaryHover mr-2">
                  تعديل
                </Link>
                <button onClick={() => handleDelete(person._id)} className="bg-danger text-white p-2 rounded hover:bg-dangerHover">
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