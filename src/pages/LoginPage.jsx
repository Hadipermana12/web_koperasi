import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/userApi';
import logo from '../assets/logoo.png';
import swirl from '../assets/3d_swirl.jpg';
import { Lock, User, Loader2, AlertCircle, Eye, EyeOff, HelpCircle, FileText } from 'lucide-react';

export default function LoginPage() {
  const [npk, setNpk] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      if (!allowedRoles.includes(data.user.role?.toUpperCase())) {
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
    <div className="h-screen w-screen flex items-center justify-center bg-[#070b19] text-white p-4 relative overflow-hidden font-sans select-none">
      
      {/* Background Ambient Glows with Liquify Animations */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#76bc21]/20 rounded-full blur-[130px]" 
          style={{ animation: 'float-blob-1 10s infinite alternate ease-in-out' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#005bb7]/25 rounded-full blur-[150px]" 
          style={{ animation: 'float-blob-2 12s infinite alternate ease-in-out' }}
        />
        <div 
          className="absolute top-[30%] right-[20%] w-[50%] h-[50%] bg-[#76bc21]/15 rounded-full blur-[120px]" 
          style={{ animation: 'float-blob-3 8s infinite alternate ease-in-out' }}
        />
      </div>

      {/* 3D Swirl Graphic (Emulating the Reference Top-Left Swirl - Centered, Resized & Faded) */}
      <div className="absolute top-1/2 left-[-20%] md:left-[-15%] w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] -translate-y-1/2 pointer-events-none z-10 select-none opacity-15">
        <img 
          src={swirl} 
          alt="Abstract 3D Shape" 
          className="w-full h-full object-contain rounded-full mask-gradient"
          style={{ mixBlendMode: 'lighten' }}
        />
      </div>

      {/* Main Container: 2 Columns */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 relative z-20 px-4 md:px-8">
        
        {/* Left Side: KMMA Info / Branding */}
        <div className="flex-1 text-left flex flex-col items-start mt-20 md:mt-0">
          <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
            <img 
              src={logo} 
              alt="KMMA Logo" 
              className="h-16 md:h-20 w-auto"
              style={{ animation: 'logo-shimmer-glow 3s infinite ease-in-out' }}
            />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-[1.15] tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#76bc21] bg-clip-text text-transparent">
            Portal Dashboard<br/>Koperasi Menara Terus Makmur
          </h2>
          
          <p className="text-slate-400 font-normal text-sm md:text-base max-w-[480px] leading-relaxed mb-8">
            "Sinergi untuk Sejahtera bersama Koperasi Menara Terus Makmur. Kelola transaksi, anggota, dan keuangan koperasi Anda dengan efisien."
          </p>

          {/* Buttons similar to Reference (What to Expect / Link) */}
          <div className="flex items-center gap-6">
            <a 
              href="#"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold text-xs tracking-wider uppercase hover:underline transition-colors"
            >
              <FileText size={14} className="text-blue-400" />
              <span>Panduan Aplikasi</span>
            </a>
          </div>
        </div>

        {/* Right Side: Glassmorphism Login Card (Light Mode Reworked) */}
        <div className="w-full md:w-[440px] shrink-0">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.25)] relative overflow-hidden text-slate-800">
            
            {/* Ambient Line light */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#76bc21] to-transparent opacity-70" />
            
            <div className="mb-8">
              <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1.5">Masuk ke Akun</h1>
              <p className="text-slate-500 text-xs font-semibold">Gunakan NPK dan password terdaftar Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-700 text-xs backdrop-blur-md">
                  <AlertCircle size={16} className="shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* NPK Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">NPK / Username</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#76bc21] transition-colors">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    value={npk}
                    onChange={(e) => setNpk(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-[#76bc21]/50 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 text-xs font-semibold"
                    placeholder="Contoh: 12345"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#005bb7] transition-colors">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-[#005bb7]/50 rounded-xl pl-11 pr-12 py-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 text-xs font-semibold"
                    placeholder="Masukkan kata sandi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Helper Links */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 bg-slate-50 text-[#76bc21] focus:ring-[#76bc21] focus:ring-offset-white"
                  />
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-800 transition-colors font-medium">Ingat Saya</span>
                </label>
                <a href="#" className="text-[11px] text-slate-500 hover:text-slate-800 hover:underline transition-colors font-medium">Lupa Password?</a>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#76bc21] to-[#00a8e8] hover:from-[#86cc31] hover:to-[#00d1ff] active:scale-[0.98] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs shadow-xl shadow-[#76bc21]/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-white" size={15} />
                      <span>MEMPROSES...</span>
                    </>
                  ) : (
                    'MASUK SEKARANG'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <p className="text-slate-400 text-[10px] font-bold tracking-wider uppercase">
                Koperasi Menara Terus Makmur &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logo-shimmer-glow {
          0%, 100% {
            filter: brightness(1.1) drop-shadow(0 0 15px rgba(0, 91, 183, 0.3));
          }
          50% {
            filter: brightness(1.45) drop-shadow(0 0 35px rgba(118, 188, 33, 0.7));
          }
        }
        @keyframes float-blob-1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
          100% { transform: translate(-30px, -60px) scale(0.9); }
        }
        @keyframes float-blob-2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 70px) scale(0.95); }
          100% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes float-blob-3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(70px, -40px) scale(1.08); }
          100% { transform: translate(-60px, 60px) scale(0.92); }
        }
      `}} />
    </div>
  );
}
