// components/Navbar.js
'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          برنامج استقبال
        </Link>
        <div className='flex gap-5'>
          {session?.user.role === 'receptionist' && (
            <>
              <Link href="/receptionist" className="text-white mr-4">
                الاستقبال
              </Link>
              <Link href="/admin/organizations" className="text-white mr-4">
                الجهات
              </Link>
              <Link href="/admin/people" className="text-white mr-4">
                الأشخاص
              </Link>
            </>
          )}
          {session?.user.role === 'manager' && (
            <Link href="/manager" className="text-white mr-4">
              المدير
            </Link>
          )}
          {session ? (
            <button onClick={() => signOut()} className="text-white">
              تسجيل الخروج
            </button>
          ) : (
            <Link href="/api/auth/signin" className="text-white">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}