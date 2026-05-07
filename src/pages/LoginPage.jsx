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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#005bb7] via-[#00a8e8] to-[#00d1ff] p-4 lg:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-white/10 rounded-[2rem] rotate-12 animate-pulse"></div>
        <div className="absolute top-[20%] left-[15%] w-48 h-48 bg-white/5 rounded-[1.5rem] -rotate-12"></div>
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-white/10 rounded-[3rem] rotate-45"></div>
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-white/20 to-transparent blur-3xl opacity-50"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full bg-white rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-green-100 relative z-10">
        
        {/* Left Side: Illustration (White Background) */}
        <div className="hidden md:flex flex-1 bg-white relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#76bc21]/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="mb-12 transform hover:scale-110 transition-transform duration-700">
              <img 
                src={logo} 
                alt="KMMA Logo" 
                className="w-[22rem] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-float" 
                style={{ animation: 'float 6s ease-in-out infinite' }}
              />
            </div>
            
            <div className="bg-[#005bb7] px-10 py-4 rounded-full mb-6 shadow-xl shadow-blue-900/10">
              <p className="text-white font-black uppercase tracking-[0.3em] text-sm">KMMA ONE</p>
            </div>
            
            <h2 className="text-3xl font-black text-[#005bb7] mb-3 leading-tight tracking-tight">
              PORTAL DASHBOARD<br/>ADMIN KMMA
            </h2>
            <div className="w-16 h-1 bg-[#76bc21] rounded-full mb-4 mx-auto"></div>
            <p className="text-slate-500 font-semibold text-sm max-w-[300px] leading-relaxed">
              "Sinergi untuk Sejahtera bersama Koperasi Menara Terus Makmur"
            </p>
          </div>
        </div>

        {/* Right Side: Form (Green/Blue Gradient Background) */}
        <div className="flex-1 p-8 md:p-16 lg:p-20 flex flex-col bg-gradient-to-br from-[#76bc21] via-[#00a8e8] to-[#005bb7] relative overflow-hidden">
          {/* Decorative shapes for the form side */}
          <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-white/10 rounded-[4rem] rotate-12"></div>
          
          <div className="relative z-10">
            {/* Avatar Icon */}
            <div className="mb-12">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 overflow-hidden transform -rotate-3">
                <User size={36} className="text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Login</h1>
            <p className="text-blue-50 font-medium mb-10 opacity-80">Silakan masuk ke akun admin Anda</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-3 bg-white/10 border border-white/20 rounded-lg flex items-center gap-2 text-white text-sm mb-6 backdrop-blur-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* NPK Input */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-white uppercase tracking-widest ml-1">NPK / Username</label>
                <input
                  type="text"
                  required
                  value={npk}
                  onChange={(e) => setNpk(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/30 py-4 text-white outline-none focus:border-white transition-all placeholder:text-white/40"
                  placeholder="Masukkan NPK"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-white uppercase tracking-widest ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/30 py-4 text-white outline-none focus:border-white transition-all placeholder:text-white/40"
                  placeholder="Masukkan password"
                />
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-blue-50 disabled:bg-white/50 text-[#005bb7] font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-2xl shadow-black/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>MEMPROSES...</span>
                    </>
                  ) : (
                    'MASUK SEKARANG'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-12 text-center md:text-left">
              <p className="text-white/70 text-sm font-medium">
                Butuh bantuan akses? <a href="#" className="text-white font-bold hover:underline">Hubungi IT Support</a>
              </p>
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
