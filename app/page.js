// app/page.js
export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">مرحبًا بك في نظام إدارة الزيارات</h1>
      <p className="mb-4">يرجى اختيار الصفحة التي ترغب في الوصول إليها:</p>
      <div className="space-x-4">
        <a href="/receptionist" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">صفحة الاستقبال</a>
        <a href="/manager" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">صفحة المدير</a>
      </div>
    </div>
  )
}