// app/admin/add-person/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AccessDenied from '@/components/AccessDenied';
import toast from 'react-hot-toast';

export default function AddPersonPage() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  
  useEffect(() => {
    fetch('/api/organizations')
      .then(res => res.json())
      .then(data => setOrganizations(data))
      .catch(err => setError('Failed to load organizations'));
  }, []);

  if (status === 'loading') return <p>جاري التحميل...</p>;
  if (!session || session.user.role !== 'receptionist') {
    return <AccessDenied />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title, organization: organizationId }),
      });

      if (!response.ok) throw new Error('Failed to add person');

      const data = await response.json();
      setName('');
      setTitle('');
      setOrganizationId('');
      toast.success('تمت إضافة الشخص بنجاح');

      router.push('/admin/people'); // افتراض وجود صفحة لعرض الأشخاص
    } catch (err) {
      setError('حدث خطأ أثناء إضافة الشخص');
      toast.error('حدث خطأ أثناء إضافة الجهة');

    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">إضافة شخص جديد</h1>
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
          إضافة الشخص
        </button>
      </form>
      {error && toast.error(error)}
    </div>
  );
}