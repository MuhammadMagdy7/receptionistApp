// components/VisitForm.jsx
import { useState } from 'react';
import PersonOrganizationSearch from './PersonOrganizationSearch';

export default function VisitForm({ onSubmit }) {
  const [visitorName, setVisitorName] = useState('');
  const [visitorTitle, setVisitorTitle] = useState('');
  const [visitorOrganization, setVisitorOrganization] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('');
  const [error, setError] = useState('');

  const handlePersonOrganizationSelect = (item) => {
    if (item.type === 'person') {
      setVisitorName(item.name);
      setVisitorTitle(item.title);
      setVisitorOrganization(item.organization.name);
    } else {
      setVisitorOrganization(item.name);
    }
  };

  const handleAddNewOrganization = async (name) => {
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        const newOrg = await response.json();
        setVisitorOrganization(newOrg.name);
      } else {
        throw new Error('Failed to add organization');
      }
    } catch (error) {
      setError('فشل في إضافة الجهة الجديدة');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!visitorName || !visitorTitle || !visitorOrganization || !visitPurpose) {
      setError('جميع الحقول مطلوبة.');
      return;
    }
    onSubmit({ visitorName, visitorTitle, visitorOrganization, visitPurpose });
    // إعادة تعيين حقول النموذج
    setVisitorName('');
    setVisitorTitle('');
    setVisitorOrganization('');
    setVisitPurpose('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <PersonOrganizationSearch 
        onSelect={handlePersonOrganizationSelect}
        onAddNewOrganization={handleAddNewOrganization}
      />
      <input
        type="text"
        value={visitorName}
        onChange={(e) => setVisitorName(e.target.value)}
        placeholder="اسم الزائر"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        value={visitorTitle}
        onChange={(e) => setVisitorTitle(e.target.value)}
        placeholder="الصفة"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        value={visitorOrganization}
        onChange={(e) => setVisitorOrganization(e.target.value)}
        placeholder="الجهة"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        value={visitPurpose}
        onChange={(e) => setVisitPurpose(e.target.value)}
        placeholder="سبب الزيارة"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        تسجيل الزيارة
      </button>
    </form>
  );
}