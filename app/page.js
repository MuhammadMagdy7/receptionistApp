// app/page.js
'use client'
import { useSession } from 'next-auth/react';

export default function Home() {

  const { data: session } = useSession();
  if (!session) return <h2>من فضلك سجل الدخول اولا</h2>
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">مرحبًا بك في نظام إدارة الزيارات</h1>
      <p className="mb-4">يرجى اختيار الصفحة التي ترغب في الوصول إليها:</p>
      <div className="space-x-4">
      {session?.user.role === 'receptionist' && (
        <a href="/receptionist" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">صفحة الاستقبال</a>

          )}
          {session?.user.role === 'manager' && (
        <a href="/manager" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">صفحة المدير</a>

          )}
      </div>
    </div>
  )
}