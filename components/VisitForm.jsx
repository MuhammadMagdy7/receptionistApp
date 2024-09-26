// components/VisitForm.jsx
import { useState } from 'react';
import PersonSearch from './PersonSearch';

export default function VisitForm({ onSubmit }) {
  const [visitorName, setVisitorName] = useState('');
  const [visitorTitle, setVisitorTitle] = useState('');
  const [visitorOrganization, setVisitorOrganization] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('');
  const [error, setError] = useState('');

  const handlePersonSelect = (person) => {
    setVisitorName(person.name);
    setVisitorTitle(person.title);
    setVisitorOrganization(person.organization.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!visitorName || !visitorTitle || !visitorOrganization || !visitPurpose) {
      setError('جميع الحقول مطلوبة.');
      return;
    }
    onSubmit({ visitorName, visitorTitle, visitorOrganization, visitPurpose });
    setVisitorName('');
    setVisitorTitle('');
    setVisitorOrganization('');
    setVisitPurpose('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center">تسجيل زيارة جديدة</h2>
      {error && <p className="text-danger mb-4 text-center">{error}</p>}
      <div className="mb-6">
        <PersonSearch onSelect={handlePersonSelect} />
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          placeholder="اسم الزائر"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={visitorTitle}
          onChange={(e) => setVisitorTitle(e.target.value)}
          placeholder="الصفة"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={visitorOrganization}
          onChange={(e) => setVisitorOrganization(e.target.value)}
          placeholder="الجهة"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-6">
        <textarea
          value={visitPurpose}
          onChange={(e) => setVisitPurpose(e.target.value)}
          placeholder="سبب الزيارة"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button type="submit" className="bg-primary hover:bg-primaryHover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          تسجيل الزيارة
        </button>
      </div>
    </form>
  );
}