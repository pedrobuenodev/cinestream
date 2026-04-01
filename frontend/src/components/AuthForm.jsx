import { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

export default function AuthForm({ mode, onSubmit, loading, error }) {
  const isLogin = mode === 'login';
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <div className="min-h-screen bg-cine-dark flex items-center justify-center px-4">
      {/* Background overlay image */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg')" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block text-center mb-10">
          <span
            className="text-cine-red font-bold text-4xl tracking-wider"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}
          >
            CINESTREAM
          </span>
        </Link>

        <div className="bg-black/80 backdrop-blur-sm rounded-xl px-8 py-10 border border-white/10 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            {isLogin ? "Welcome back. We've missed you." : 'Start watching in seconds.'}
          </p>

          {error && (
            <div className="flex items-center gap-3 bg-red-900/40 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
              <FiAlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Full Name</label>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Pedro Silva"
                  className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-cine-red transition-colors placeholder-gray-600"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-cine-red transition-colors placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-cine-red transition-colors placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-cine-red hover:bg-cine-red-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              href={isLogin ? '/register' : '/login'}
              className="text-white hover:text-cine-red transition-colors font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Link>
          </p>

          {isLogin && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg text-xs text-gray-400">
              <p className="font-medium text-gray-300 mb-1">Demo accounts:</p>
              <p>user@cinestream.com / user123</p>
              <p>admin@cinestream.com / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
