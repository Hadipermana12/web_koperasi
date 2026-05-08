import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SummaryCard({ 
  title, 
  value, 
  trend, 
  isPositive, 
  trendText,
  icon: Icon,
  iconColor,
  iconBg
}) {
  // Determine gradient based on type
  const getGradient = () => {
    if (iconBg.includes('green')) return 'from-green-500/10 to-emerald-500/5 hover:from-green-500 hover:to-emerald-600 group-hover:shadow-[0_20px_40px_rgba(34,197,94,0.2)]';
    if (iconBg.includes('blue')) return 'from-blue-500/10 to-indigo-500/5 hover:from-[#005bb7] hover:to-[#00a8e8] group-hover:shadow-[0_20px_40px_rgba(0,91,183,0.2)]';
    if (iconBg.includes('yellow')) return 'from-orange-500/10 to-amber-500/5 hover:from-orange-500 hover:to-amber-500 group-hover:shadow-[0_20px_40px_rgba(249,115,22,0.2)]';
    return 'from-purple-500/10 to-fuchsia-500/5 hover:from-purple-500 hover:to-fuchsia-600 group-hover:shadow-[0_20px_40px_rgba(168,85,247,0.2)]';
  };

  const getIconColors = () => {
    if (iconBg.includes('green')) return 'text-green-600 group-hover:text-white';
    if (iconBg.includes('blue')) return 'text-[#005bb7] group-hover:text-white';
    if (iconBg.includes('yellow')) return 'text-orange-600 group-hover:text-white';
    return 'text-purple-600 group-hover:text-white';
  };

  return (
    <div className="group relative bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:bg-white/90 overflow-hidden flex flex-col justify-between h-full">
      {/* Background Decor */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl rounded-full ${getGradient()}`}></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 bg-gradient-to-br ${getGradient()} ${getIconColors()} border border-white shadow-sm`}>
          <Icon size={32} className="transition-transform group-hover:scale-110 duration-500" />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
          isPositive ? 'bg-green-50 text-green-600 border-green-100 group-hover:bg-green-500 group-hover:text-white' : 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-500 group-hover:text-white'
        }`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
          <span className="text-xs font-bold text-slate-400">{trendText}</span>
        </div>
      </div>
    </div>
  );
}
