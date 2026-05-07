import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/userApi';
import logo from '../assets/logoo.png';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [npk, setNpk] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginApi(npk, password);
      
      const allowedRoles = ['ADMIN', 'HEAD', 'STAFF'];
      if (!allowedRoles.includes(data.user.role)) {
        setError('Akses ditolak. Anda tidak memiliki izin untuk mengakses aplikasi ini.');
        return;
      }

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Silakan periksa NPK dan Password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#004aad] p-4 lg:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#004aad] via-[#003d8f] to-[#002b66]"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-green-400/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full bg-white/5 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-md relative z-10">
        
        {/* Left Side: Form */}
        <div className="flex-1 p-8 md:p-16 lg:p-20 flex flex-col">
          {/* Avatar Icon */}
          <div className="mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
              <User size={28} className="text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-white mb-10 tracking-wide">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-8 flex-1">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm mb-6">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* NPK Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white uppercase tracking-wider">NPK / Username</label>
              <input
                type="text"
                required
                value={npk}
                onChange={(e) => setNpk(e.target.value)}
                className="w-full bg-transparent border-b-2 border-white/20 py-2 text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"
                placeholder="Enter your NPK"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-white/20 py-2 text-white outline-none focus:border-blue-500 transition-colors placeholder:text-white/20"
                placeholder="Enter your password"
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-[#004aad] hover:from-blue-500 hover:to-[#0056b3] disabled:from-slate-700 disabled:to-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs border border-white/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center md:text-left">
            <p className="text-white/60 text-sm">
              Don't have access? <a href="#" className="text-white font-bold hover:underline">Contact IT Support</a>
            </p>
          </div>
        </div>

        {/* Right Side: Illustration Area */}
        <div className="hidden md:flex flex-1 bg-white/5 relative items-center justify-center overflow-hidden">
          {/* Abstract Shape / Blob - Brand Colors */}
          <div className="absolute right-0 bottom-0 w-full h-[90%] bg-gradient-to-tr from-[#10b981] via-[#004aad] to-[#004aad] rounded-tl-[15rem] z-0 opacity-90 shadow-2xl"></div>
          
          {/* Illustration */}
          <div className="relative z-10 p-12 text-center">
            <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 shadow-2xl">
              <img 
                src={logo} 
                alt="KMMA Illustration" 
                className="w-48 h-auto drop-shadow-2xl animate-float mx-auto" 
                style={{ animation: 'float 6s ease-in-out infinite' }}
              />
              <div className="mt-8">
                <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">PORTAL DASHBOARD ADMIN KMMA</h2>
                <p className="text-blue-50/80 text-sm font-medium max-w-xs mx-auto">Sistem Informasi Koperasi Menara Terus Makmur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}} />
    </div>
  );
}
