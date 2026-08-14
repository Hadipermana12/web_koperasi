import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SummaryCard({ title, value, trend, isPositive, trendText, to, onClick }) {
  const cardContent = (
    <div className={`bg-[#0f172a] border border-[#76bc21]/40 rounded-xl p-5 shadow-sm hover:border-[#76bc21] hover:shadow-lg transition-all duration-200 flex flex-col justify-between min-h-[125px] ${to || onClick ? 'cursor-pointer hover:scale-[1.01]' : ''}`}>
      <div className="flex justify-between items-start mb-2 gap-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-snug group-hover:text-slate-200 transition-colors">{title}</p>
        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
          isPositive ? 'bg-green-500/10 text-[#76bc21]' : 'bg-red-500/10 text-red-400'
        }`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white leading-none mb-1.5">{value}</p>
        {trendText && <span className="text-xs text-slate-500 font-medium">{trendText}</span>}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="group block focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick} className="group block focus:outline-none">
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
