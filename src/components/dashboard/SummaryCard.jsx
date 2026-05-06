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
  // Override incoming bg colors to match light glassmorphism
  const bgOverride = iconBg.includes('green') ? 'bg-green-100 border border-green-200 shadow-sm' : 
                     iconBg.includes('blue') ? 'bg-blue-100 border border-blue-200 shadow-sm' : 
                     iconBg.includes('yellow') ? 'bg-amber-100 border border-amber-200 shadow-sm' : 
                     'bg-purple-100 border border-purple-200 shadow-sm';
                     
  const colorOverride = iconColor.includes('green') ? 'text-green-600' : 
                        iconColor.includes('blue') ? 'text-blue-600' : 
                        iconColor.includes('yellow') ? 'text-amber-600' : 
                        'text-purple-600';

  return (
    <div className="glass-bento glass-bento-hover p-6 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Subtle glow behind card */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white rounded-full blur-2xl group-hover:bg-blue-50/50 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-gray-500 font-medium text-sm mb-2 uppercase tracking-wider">{title}</h3>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgOverride} ${colorOverride}`}>
          <Icon size={28} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-2 relative z-10">
        <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-md border ${isPositive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trend}
        </div>
        <span className="text-gray-500 text-xs font-medium">
          {trendText}
        </span>
      </div>
    </div>
  );
}
