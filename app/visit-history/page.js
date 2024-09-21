// app/visit-history/page.js
'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVisits } from '@/lib/redux/visitSlice';
import VisitList from '@/components/VisitList';

export default function VisitHistoryPage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const visits = useSelector(state => state.visits.visits);
  const fetchStatus = useSelector(state => state.visits.status);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) signIn();
  }, [session, status]);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchVisits());
    }
  }, [fetchStatus, dispatch]);

  if (status === 'loading' || !session) {
    return <p>جارٍ التحميل...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">سجل الزيارات</h1>
      <VisitList visits={visits} showActions={false} />
    </div>
  );
}