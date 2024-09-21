// app/layout.js
import './globals.css';
import ClientProviders from './ClientProviders';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-100">
        <ClientProviders>
          <Navbar />
          <main className="container mx-auto mt-8">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
