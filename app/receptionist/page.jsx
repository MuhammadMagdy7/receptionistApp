// app/receptionist/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitAsync, fetchVisits, hideVisitAsync, updateVisitInStore } from '@/lib/redux/visitSlice';
import VisitForm from '@/components/VisitForm';
import VisitList from '@/components/VisitList';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { emitAddVisit, emitHideVisit } from '@/lib/socket';
import SoundPlayer from '@/components/SoundPlayer';

export default function ReceptionistPage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const visits = useSelector(state => state.visits.visits);
  const fetchStatus = useSelector(state => state.visits.status);
  const error = useSelector(state => state.visits.error);
  const socket = useWebSocket();
  const [playSound, setPlaySound] = useState(false);

  const handlePlayEnd = useCallback(() => {
    setPlaySound(false);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) signIn();
    if (session?.user.role !== 'receptionist') signIn();
  }, [session, status]);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchVisits());
    }
  }, [fetchStatus, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('visit:updated', (updatedVisit) => {
        console.log('Visit updated:', updatedVisit);
        dispatch(updateVisitInStore(updatedVisit));
        setPlaySound(true);
      });

      return () => {
        socket.off('visit:updated');
      };
    }
  }, [socket, dispatch]);

  const handleAddVisit = async (visitData) => {
    try {
      const resultAction = await dispatch(addVisitAsync(visitData));
      if (addVisitAsync.fulfilled.match(resultAction)) {
        emitAddVisit(resultAction.payload);
      }
    } catch (error) {
      console.error('Error adding visit:', error);
    }
  };

  const handleHideVisit = (id) => {
    dispatch(hideVisitAsync(id));
    emitHideVisit(id);
  };

  if (status === 'loading' || !session) {
    return <p>جارٍ التحميل...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">صفحة الاستقبال</h1>
      <VisitForm onSubmit={handleAddVisit} />
      {fetchStatus === 'loading' && <p>جارٍ تحميل الزيارات...</p>}
      {error && <p className="text-red-500">خطأ: {error}</p>}
      <VisitList 
        visits={visits.filter(visit => !visit.isHidden)} 
        showActions={true} 
        onHideVisit={handleHideVisit}
        showStatusButtons={false}
      />
      <SoundPlayer 
        soundUrl="/notification.mp3" 
        play={playSound}
        onPlayEnd={handlePlayEnd}
      />
    </div>
  );
}