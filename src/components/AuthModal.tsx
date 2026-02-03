'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  setMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: string;
  setMode: (mode: string) => void;
}) {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const scrollTop = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollTop}px`;
      document.body.style.width = '100%';
    } else {
      const scrollTop = parseInt(document.body.style.top || '0') * -1;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollTop);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const response = await axios.post('/api/auth/login', {
          username: formData.username,
          password: formData.password,
        });

        const { token, user } = response.data;
        login(user, token);
        alert(`歡迎回來，${user.name}！`);
      } else {
        const response = await axios.post('/api/auth/register', {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          name: formData.name,
        });

        const { userId, username } = response.data;
        // Auto login after registration
        const loginResponse = await axios.post('/api/auth/login', {
          username: username,
          password: formData.password,
        });

        const { token, user } = loginResponse.data;
        register(user, token);
        alert(`歡迎加入，${formData.name}！`);
      }

      onClose();
      setFormData({ username: '', name: '', email: '', password: '' });
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'An error occurred. Please try again.';
      setError(message);
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const switchMode = (newMode: string) => {
    setMode(newMode);
    setFormData({ username: '', name: '', email: '', password: '' });
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'login' ? '歡迎回來' : '建立新帳號'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          // Login Form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                用戶名
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="請輸入用戶名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                密碼
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {isLoading ? '登入中...' : '登入系統'}
            </button>
            <p className="text-center text-sm text-slate-500">
              還沒有帳號？{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-blue-600 font-bold hover:underline"
              >
                立即註冊
              </button>
            </p>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="您的名字"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                用戶名
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="選擇唯一的用戶名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                電子郵件
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                設定密碼
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="至少 6 個字元"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg disabled:opacity-50"
            >
              {isLoading ? '註冊中...' : '註冊並開始'}
            </button>
            <p className="text-center text-sm text-slate-500">
              已有帳號？{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-blue-600 font-bold hover:underline"
              >
                返回登入
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
