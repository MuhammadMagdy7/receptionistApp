// app/components/VisitList
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useEffect, useState } from 'react';

export default function VisitList({ visits, showActions = false, onStatusUpdate, onDeleteVisit, showStatusButtons = true }) {
  const [countVisits, setCountVisits] = useState(0);

  useEffect(() => {
    setCountVisits(visits.length)

  }, [visits]);

  if (visits.length === 0) {
    return <p>لا توجد زيارات مسجلة.</p>;
  }

  const getBackgroundColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-accepted';
      case 'rejected': return 'bg-rejected';
      case 'pending': return 'bg-pending';
      default: return 'bg-default';
    }
  };

  const getStatusInArabic = (status) => {
    switch(status) {
      case 'accepted': return 'مقبول';
      case 'rejected': return 'مرفوض';
      case 'pending': return 'قيد الانتظار';
      default: return status;
    }
  };

  const sortedVisits = [...visits].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="mt-4">
      <div className='flex justify-between'>
      <h2 className="text-xl font-semibold mb-2 text-center">قائمة الزيارات</h2>
      <p> عدد الزيارات <span className='bg-red-300 p-2 rounded-md'>{countVisits}</span></p>

      </div>
      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 border-b">الاسم</th>
            <th className="py-3 px-4 border-b">الصفة</th>
            <th className="py-3 px-4 border-b">الجهة</th>
            <th className="py-3 px-4 border-b">السبب</th>
            <th className="py-3 px-4 border-b">الحالة</th>
            <th className="py-3 px-4 border-b">تم الإنشاء</th>
            <th className="py-3 px-4 border-b">آخر تحديث</th>
            {showActions && <th className="py-3 px-4 border-b">الإجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {sortedVisits.map((visit) => (
            <tr key={visit._id} className={`${getBackgroundColor(visit.status)} text-center transition`}>
              <td className="border px-4 py-2">{visit.visitorName}</td>
              <td className="border px-4 py-2">{visit.visitorTitle}</td>
              <td className="border px-4 py-2">{visit.visitorOrganization}</td>
              <td className="border px-4 py-2">{visit.visitPurpose}</td>
              <td className="border px-4 py-2">{getStatusInArabic(visit.status)}</td>
              <td className="border px-4 py-2">{formatDistanceToNow(new Date(visit.createdAt), { addSuffix: true, locale: ar })}</td>
              <td className="border px-4 py-2">{formatDistanceToNow(new Date(visit.updatedAt), { addSuffix: true, locale: ar })}</td>
              {showActions && (
                <td className="border px-4 py-2">
                  <div className="flex justify-center space-x-2">
                    {showStatusButtons && (
                      <div className='flex gap-2'>
                        <button 
                          onClick={() => onStatusUpdate(visit._id, 'accepted')}
                          className="bg-secondary text-white px-3 py-1 rounded hover:bg-secondaryHover"
                        >
                          قبول
                        </button>
                        <button 
                          onClick={() => onStatusUpdate(visit._id, 'rejected')}
                          className="bg-danger text-white px-3 py-1 rounded hover:bg-dangerHover"
                        >
                          رفض
                        </button>
                        <button 
                          onClick={() => onStatusUpdate(visit._id, 'pending')}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          انتظار
                        </button>
                      </div>
                    )}
                    {onDeleteVisit && (
                      <button 
                        onClick={() => onDeleteVisit(visit._id)}
                        className="bg-danger text-white px-3 py-1 rounded hover:bg-dangerHover"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

VisitList.propTypes = {
  visits: PropTypes.array.isRequired,
  showActions: PropTypes.bool,
  onStatusUpdate: PropTypes.func,
  onDeleteVisit: PropTypes.func,
  showStatusButtons: PropTypes.bool,
};