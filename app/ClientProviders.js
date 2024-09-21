// app/ClientProviders.js
'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { WebSocketProvider } from '@/contexts/WebSocketContext';

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </Provider>
    </SessionProvider>
  );
}