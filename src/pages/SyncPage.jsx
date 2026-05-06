import React from 'react';
import { RefreshCw, Database, Smartphone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useUsers } from '../api/userApi';

export default function SyncPage() {
  const { isFetching, refetch, data: users } = useUsers();

  const handleManualSync = () => {
    refetch();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sinkronisasi Data</h1>
        <p className="text-gray-500 text-sm">Kelola koneksi antara Mobile App dan Backend Server.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Connection Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Status Koneksi</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                  <Database size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Database Server</p>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                    Terhubung (v1.0.0)
                  </p>
                </div>
              </div>
              <CheckCircle2 className="text-green-600" size={24} />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                  <Smartphone size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mobile API Access</p>
                  <p className="text-xs text-blue-600 font-medium">Aktif (Bearer Auth Enabled)</p>
                </div>
              </div>
              <CheckCircle2 className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={handleManualSync}
              disabled={isFetching}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-100 disabled:bg-gray-300"
            >
              {isFetching ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <RefreshCw size={20} />
              )}
              Sinkronisasi Ulang Sekarang
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 italic">
              Terakhir diperbarui: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Sync Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Data Terintegrasi</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Anggota Terdaftar</p>
              <p className="text-3xl font-black text-gray-900">{users?.length || 0}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Antrean Sync</p>
              <p className="text-3xl font-black text-gray-900">0</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-4">
            <AlertCircle className="text-yellow-600 shrink-0" size={24} />
            <div>
              <p className="text-sm font-bold text-yellow-800">Catatan Integrasi</p>
              <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                Data dari Mobile App KMMA disinkronkan secara otomatis setiap 10 detik. Pastikan server API dapat dijangkau oleh dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
