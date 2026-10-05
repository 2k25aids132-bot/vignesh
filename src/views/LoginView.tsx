import React, { useState } from 'react';
import { GraduationCap, Lock, User, ArrowRight, ShieldCheck, Database, GitBranch } from 'lucide-react';

interface LoginViewProps {
  onLogin: (userName?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('vicky');
  const [password, setPassword] = useState('vicky@123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();

    if ((u === 'vicky' && p === 'vicky@123') || (u === 'admin' && p === 'admin123')) {
      setError(null);
      onLogin(u === 'vicky' ? 'Vicky' : 'Admin');
    } else {
      setError('Invalid credentials. Use vicky / vicky@123 or admin / admin123');
    }
  };

  const handleLoginAsVicky = () => {
    setUsername('vicky');
    setPassword('vicky@123');
    setError(null);
    onLogin('Vicky');
  };

  const handleLoginAsAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
    onLogin('Admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-xl shadow-sky-600/30">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Student Record Management System
        </h2>
        <p className="mt-1 text-center text-xs text-sky-400 font-mono">
          College DSA Capstone Evaluation Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          {/* Academic Banner Image */}
          <div className="relative h-28 -mx-6 -mt-8 sm:-mx-10 sm:-mt-8 mb-6 overflow-hidden rounded-t-2xl border-b border-slate-200">
            <img
              src="/src/assets/images/academic_dsa_banner_1791214250795.jpg"
              alt="Academic Data Structures and Algorithms Lab Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent flex items-end p-4">
              <span className="text-[11px] font-mono text-sky-300 font-semibold tracking-wide">
                DSA Laboratory &middot; Department of CSE
              </span>
            </div>
          </div>

          {/* DSA Badge info */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-800 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DSA Architecture Ready</span>
              </span>
              <span className="text-[10px] font-mono text-slate-600">SQLite + Python</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Demonstrating Singly Linked List, Linear Search, Binary Search, Bubble Sort, and Merge Sort.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty / Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white"
                  placeholder="admin123"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
              >
                <span>Sign In to Academic Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={handleLoginAsVicky}
              className="w-full py-2 px-3 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Instant Login as Vicky (vicky / vicky@123)</span>
            </button>
            <button
              type="button"
              onClick={handleLoginAsAdmin}
              className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Login as Default Admin (admin / admin123)</span>
            </button>
            <p className="text-[10px] text-center text-slate-600 mt-2 font-mono">
              Fictional sample database pre-loaded with 14 student records
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5" />
            <span>SQLite 3</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Pure Manual DSA</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Zero Stacks/Queues/Hash</span>
        </div>
      </div>
    </div>
  );
};
