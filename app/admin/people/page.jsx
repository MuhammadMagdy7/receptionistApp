// app/admin/people/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AccessDenied from '@/components/AccessDenied';

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


  useEffect(() => {
    fetch('/api/organizations')
      .then(res => res.json())
      .then(data => setOrganizations(data))
      .catch(err => setError('Failed to load organizations'));
  }, []);

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
        if (!response.ok) throw new Error('Failed to delete person');
        setPeople(people.filter(person => person._id !== id));
      } catch (err) {
        setError('حدث خطأ أثناء حذف الشخص');
      }
    }
  };

  if (status === 'loading') return <p>جاري التحميل...</p>;
  if (!session || session.user.role !== 'receptionist') {
    return <AccessDenied />;
  }

  if (isLoading) return <p>جاري تحميل البيانات...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredPeople = selectedOrganizationId
  ? people.filter((person) => person.organization._id === selectedOrganizationId)
  : people;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">قائمة الأشخاص</h1>
      <Link href="/admin/add-person" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4 inline-block">
        إضافة شخص جديد
      </Link>
      <ul className="mt-4">
      <select
        value={selectedOrganizationId}
        onChange={(e) => setSelectedOrganizationId(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">جميع الجهات</option>
        {organizations.map(org => (
          <option key={org._id} value={org._id}>{org.name}</option>
        ))}
      </select>

        {filteredPeople.map((person) => (
          <li key={person._id} className="border p-2 mb-2 rounded flex justify-between items-center">
            <div>
              <p><strong>الاسم:</strong> {person.name}</p>
              <p><strong>الصفة:</strong> {person.title}</p>
              <p><strong>الجهة:</strong> {person.organization.name}</p>
            </div>
            <div>
              <Link href={`/admin/edit-person/${person._id}`} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2">
                تعديل
              </Link>
              <button onClick={() => handleDelete(person._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}