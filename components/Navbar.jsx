// components/Navbar.js
'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          المنطقة ج
        </Link>
        <div>
          {session?.user.role === 'receptionist' && (
            <>
              <Link href="/receptionist" className="text-white mr-4">
                الاستقبال
              </Link>
              <Link href="/admin/add-organization" className="text-white mr-4">
                إضافة جهة
              </Link>
              <Link href="/admin/add-person" className="text-white mr-4">
                إضافة شخص
              </Link>
            </>
          )}
          {session?.user.role === 'manager' && (
            <Link href="/manager" className="text-white mr-4">
              القائد
            </Link>
          )}
          {session ? (
            <div>
              <Link href="/visit-history" > السجل </Link>


              <button onClick={() => signOut()} className="text-white">
              تسجيل الخروج
            </button>

            </div>

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