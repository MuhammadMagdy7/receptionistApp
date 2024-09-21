// app/auth/signin/page.js
'use client'

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">تسجيل الدخول</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}