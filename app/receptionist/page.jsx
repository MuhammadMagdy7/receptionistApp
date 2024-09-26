// app/receptionist/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisits, updateVisitInStore, addVisitToStore, removeVisitFromStore } from '@/lib/redux/visitSlice';
import VisitForm from '@/components/VisitForm';
import VisitList from '@/components/VisitList';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { emitAddVisit, emitDeleteVisit } from '@/lib/socket';
import SoundPlayer from '@/components/SoundPlayer';
import toast from 'react-hot-toast';

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
        toast.success('تم تحديث الزيارة');
      });

      socket.on('visit:added', (newVisit) => {
        console.log('New visit added:', newVisit);
        dispatch(addVisitToStore(newVisit));
        toast.success('تمت إضافة زيارة جديدة');
      });

      socket.on('visit:deleted', (deletedVisitId) => {
        console.log('Visit deleted:', deletedVisitId);
        dispatch(removeVisitFromStore(deletedVisitId));
        toast.success('تم حذف الزيارة');
      });

      socket.on('visit:error', (error) => {
        console.error('Error from server:', error);
      });

      return () => {
        socket.off('visit:updated');
        socket.off('visit:added');
        socket.off('visit:deleted');
        socket.off('visit:error');
      };
    }
  }, [socket, dispatch]);

  const handleAddVisit = async (visitData) => {
    try {
      const { _id, ...newVisitData } = visitData;
      emitAddVisit(newVisitData);
      toast.success('تمت إضافة الزيارة بنجاح');
    } catch (error) {
      console.error('Error adding visit:', error);
      toast.error('حدث خطأ أثناء إضافة الزيارة');
    }
  };

  const handleDeleteVisit = async (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الزيارة؟')) {
      try {
        emitDeleteVisit(id);
        toast.success('تم حذف الزيارة بنجاح');
      } catch (error) {
        console.error('Error deleting visit:', error);
        toast.error('حدث خطأ أثناء حذف الزيارة');
      }
    }
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
      <h1 className="text-2xl font-bold mb-4 text-center">صفحة الاستقبال</h1>
      <VisitForm onSubmit={handleAddVisit} />
      {fetchStatus === 'loading' && <p>جارٍ تحميل الزيارات...</p>}
      {error && <p className="text-danger">خطأ: {error}</p>}
      <VisitList 
        visits={visits} 
        showActions={true} 
        onDeleteVisit={handleDeleteVisit}
        showStatusButtons={false}
      />
    </div>
  );
}