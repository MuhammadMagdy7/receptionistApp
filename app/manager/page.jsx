// app/manager/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { updateVisitStatusAsync, fetchVisits, addVisitToStore, removeVisitFromStore } from '@/lib/redux/visitSlice';
import VisitList from '@/components/VisitList';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { emitVisitUpdate } from '@/lib/socket';
import SoundPlayer from '@/components/SoundPlayer';

export default function ManagerPage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const visits = useSelector(state => state.visits.visits);
  const fetchStatus = useSelector(state => state.visits.status);
  const socket = useWebSocket();
  const [playSound, setPlaySound] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handlePlayEnd = useCallback(() => {
    setPlaySound(false);
  }, []);


  useEffect(() => {
    if (status === 'loading') return;
    if (!session) signIn();
    if (session?.user.role !== 'manager') signIn();
  }, [session, status]);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchVisits());
    }
  }, [fetchStatus, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('visit:added', (newVisit) => {
        console.log('New visit received:', newVisit);
        dispatch(addVisitToStore(newVisit));
        setPlaySound(true);
        setShowNotification(true);
      });

      socket.on('visit:deleted', (deletedVisitId) => {
        console.log('Visit deleted:', deletedVisitId);
        dispatch(removeVisitFromStore(deletedVisitId));
      });

      return () => {
        socket.off('visit:added');
        socket.off('visit:deleted');
      };
    }
  }, [socket, dispatch]);

  const handleStatusUpdate = (id, newStatus) => {
    dispatch(updateVisitStatusAsync({ id, status: newStatus }));
    emitVisitUpdate(id, newStatus);
  };

  if (status === 'loading' || !session) {
    return <p>جارٍ التحميل...</p>;
  }
  

  return (
    <div className="container mx-auto p-4">
            <SoundPlayer 
        soundUrl="/notification.mp3" 
        play={playSound}
        onPlayEnd={handlePlayEnd}
      />
      <h1 className="text-2xl font-bold mb-4">صفحة القائد</h1>
      <VisitList 
        visits={visits.filter(visit => !visit.isHidden)} 
        showActions={true} 
        onStatusUpdate={handleStatusUpdate} 
        showStatusButtons={true}
      />

            {showNotification && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded shadow-lg">
          تمت إضافة زيارة جديدة!
          <button 
            onClick={() => setShowNotification(false)} 
            className="ml-2 bg-white text-blue-500 px-2 py-1 rounded"
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
}