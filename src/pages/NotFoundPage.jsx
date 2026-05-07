import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-bounce">
            <AlertTriangle size={48} />
          </div>
        </div>
        
        <h1 className="text-9xl font-black text-gray-200 mb-4 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan ke alamat lain.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-green-200 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <Home size={20} />
          Kembali ke Dashboard
        </Link>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            KMMA Admin System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
