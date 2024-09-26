// app/layout.js
import './globals.css';
import ClientProviders from './ClientProviders';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-background">
        <ClientProviders>
          <Navbar />
          <main className="container mx-auto mt-8">
            {children}
          </main>
          <Toaster position="bottom-left" />
        </ClientProviders>
      </body>
    </html>
  );
}
