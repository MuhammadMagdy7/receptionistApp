// contexts/WebSocketContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initSocket, onVisitUpdated, onVisitAdded } from '@/lib/socket';
import { useDispatch } from 'react-redux';
import { updateVisitInStore, addVisitToStore } from '@/lib/redux/visitSlice';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeSocket = async () => {
      const s = await initSocket();
      setSocket(s);

      onVisitUpdated((updatedVisit) => {
        dispatch(updateVisitInStore(updatedVisit));
      });

      onVisitAdded((newVisit) => {
        dispatch(addVisitToStore(newVisit));
      });
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}