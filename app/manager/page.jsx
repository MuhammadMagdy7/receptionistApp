// app/manager/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { updateVisitStatusAsync, fetchVisits, addVisitToStore, hideVisitInStore } from '@/lib/redux/visitSlice';
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
      });

      socket.on('visit:hidden', (visitId) => {
        dispatch(hideVisitInStore(visitId));
      });

      return () => {
        socket.off('visit:added');
        socket.off('visit:hidden');
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
  
  const visibleVisits = visits.filter(visit => !visit.isHidden);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">صفحة القائد</h1>
      <VisitList 
        visits={visits.filter(visit => !visit.isHidden)} 
        showActions={true} 
        onStatusUpdate={handleStatusUpdate} 
        showStatusButtons={true}
      />
      <SoundPlayer 
        soundUrl="/notification.mp3" 
        play={playSound}
        onPlayEnd={handlePlayEnd}
      />
    </div>
  );
}