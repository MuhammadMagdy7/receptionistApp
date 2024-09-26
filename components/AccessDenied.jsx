// components/AccessDenied.js
import { signIn } from 'next-auth/react';

export default function AccessDenied() {
  return (
    <div className="text-center mt-8">
      <h1 className="text-2xl font-bold mb-4">غير مصرح بالوصول</h1>
      <p className="mb-4">يجب عليك تسجيل الدخول للوصول إلى هذه الصفحة.</p>
      <button
        onClick={() => signIn()}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        تسجيل الدخول
      </button>
    </div>
  );
}