// app/page.js
'use client'
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  if (!session) return <h2>من فضلك سجل الدخول اولا</h2>
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">مرحبًا بك في نظام إدارة الزيارات</h1>
      <div className="flex justify-center space-x-4">
        {session?.user.role === 'receptionist' && (
          <a href="/receptionist" className="bg-primary text-white px-4 py-2 rounded hover:bg-primaryHover transition">
            صفحة الاستقبال
          </a>
        )}
        {session?.user.role === 'manager' && (
          <a href="/manager" className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondaryHover transition">
            صفحة المدير
          </a>
        )}
      </div>
    </div>
  )
}