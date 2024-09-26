// components/VisitList.jsx
import PropTypes from 'prop-types';
import { formatDistanceToNow, format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function VisitList({ visits, showActions = false, onStatusUpdate, onDeleteVisit, showStatusButtons = true }) {
  if (visits.length === 0) {
    return <p>لا توجد زيارات مسجلة.</p>;
  }

  const getBackgroundColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-200';
      case 'rejected': return 'bg-red-200';
      case 'pending': return 'bg-yellow-200';
      default: return 'bg-gray-200';
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

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">قائمة الزيارات</h2>
      <ul className="space-y-2">
        {visits.map((visit) => (
          <li key={visit._id} className={`border p-4 rounded shadow ${getBackgroundColor(visit.status)}`}>
            <p><strong>الاسم:</strong> {visit.visitorName}</p>
            <p><strong>الصفة:</strong> {visit.visitorTitle}</p>
            <p><strong>الجهة:</strong> {visit.visitorOrganization}</p>
            <p><strong>السبب:</strong> {visit.visitPurpose}</p>
            <p><strong>الحالة:</strong> {getStatusInArabic(visit.status)}</p>
            <p><strong>تم الإنشاء:</strong> {formatDistanceToNow(new Date(visit.createdAt), { addSuffix: true, locale: ar })}</p>
            <p><strong>آخر تحديث:</strong> {formatDistanceToNow(new Date(visit.updatedAt), { addSuffix: true, locale: ar })}</p>
            {showActions && (
              <div className="mt-2 flex space-x-2">
                {showStatusButtons && (
                  <>
                    <button 
                      onClick={() => onStatusUpdate(visit._id, 'accepted')}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      قبول
                    </button>
                    <button 
                      onClick={() => onStatusUpdate(visit._id, 'rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      رفض
                    </button>
                    <button 
                      onClick={() => onStatusUpdate(visit._id, 'pending')}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      انتظار
                    </button>
                  </>
                )}
                {onDeleteVisit && (
                  <button 
                    onClick={() => onDeleteVisit(visit._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    حذف
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
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