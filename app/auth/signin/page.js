// app/auth/signin/page.js
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h2>
        {error && <p className="text-danger mb-4 text-center">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          className="mb-4 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          className="mb-4 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button type="submit" className="bg-primary text-white p-3 rounded w-full hover:bg-primaryHover transition">
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}