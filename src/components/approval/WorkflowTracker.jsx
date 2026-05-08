import React, { useState } from 'react';
import {
  ClipboardList, UserCheck, Users, Banknote, CheckCircle,
  X, FileText, ChevronRight, AlertCircle, Clock
} from 'lucide-react';

/* ─── Stage Config ──────────────────────────────────────────── */
export const STAGES = [
  { id: 'PENDING',      step: 1, label: 'Pengajuan',    sub: 'Anggota mengajukan pinjaman', icon: ClipboardList, hex: '#3b82f6', light: '#eff6ff', border: '#bfdbfe' },
  { id: 'REVIEW_ADMIN1',step: 2, label: 'Admin 1',      sub: 'Verifikasi & review awal',    icon: UserCheck,     hex: '#6366f1', light: '#eef2ff', border: '#c7d2fe' },
  { id: 'REVIEW_ADMIN2',step: 3, label: 'Admin 2',      sub: 'Persetujuan kedua',           icon: UserCheck,     hex: '#8b5cf6', light: '#f5f3ff', border: '#ddd6fe' },
  { id: 'REVIEW_ADMIN3',step: 4, label: 'Admin 3',      sub: 'Persetujuan final',           icon: Users,         hex: '#a855f7', light: '#faf5ff', border: '#e9d5ff' },
  { id: 'APPROVED',     step: 5, label: 'Transfer Dana',sub: 'Pencairan ke rekening',       icon: Banknote,      hex: '#10b981', light: '#ecfdf5', border: '#a7f3d0' },
  { id: 'DONE',         step: 6, label: 'Selesai',      sub: 'Pinjaman aktif berjalan',     icon: CheckCircle,   hex: '#22c55e', light: '#f0fdf4', border: '#bbf7d0' },
];

function getStage(status) {
  return STAGES.find(s => s.id === status) || STAGES[0];
}

const fmtCurrency = (v) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v ?? 0);

/* ─── Arrow SVG ─────────────────────────────────────────────── */
function Arrow({ color = '#cbd5e1', active = false }) {
  return (
    <div className="flex items-center justify-center w-12 flex-shrink-0">
      <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
        <line x1="0" y1="10" x2="34" y2="10"
          stroke={active ? color : '#e2e8f0'} strokeWidth="2" strokeDasharray={active ? '0' : '4 3'}
          style={{ transition: 'stroke 0.5s' }} />
        <polygon points="34,4 44,10 34,16"
          fill={active ? color : '#e2e8f0'}
          style={{ transition: 'fill 0.5s' }} />
      </svg>
    </div>
  );
}

/* ─── Decision diamond (reject path) ───────────────────────── */
function RejectBadge() {
  return (
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
      <div className="w-px h-5 bg-red-300" />
      <span className="text-[9px] font-black text-red-400 uppercase tracking-widest bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">Tolak</span>
    </div>
  );
}

/* ─── Flow Diagram Node ─────────────────────────────────────── */
function DiagramNode({ stage, count = 0, isActive = false, isDone = false, isLast = false, loanCount = 0 }) {
  const Icon = stage.icon;
  const opacity = isDone ? 1 : isActive ? 1 : 0.4;

  return (
    <div className="flex flex-col items-center gap-3 relative" style={{ opacity, transition: 'opacity 0.5s' }}>
      {/* Step number */}
      <div className="text-[9px] font-black uppercase tracking-[0.3em]"
        style={{ color: isDone || isActive ? stage.hex : '#94a3b8' }}>
        Step {stage.step}
      </div>

      {/* Main Node Box */}
      <div
        className="relative flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border-2 transition-all duration-700"
        style={{
          background: isDone || isActive ? stage.light : '#f8fafc',
          borderColor: isDone || isActive ? stage.hex : '#e2e8f0',
          boxShadow: isActive ? `0 0 0 4px ${stage.hex}22, 0 8px 24px ${stage.hex}33` : 'none',
          minWidth: 120,
        }}
      >
        {/* Active pulse ring */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl border-2 animate-ping"
            style={{ borderColor: stage.hex, opacity: 0.3 }} />
        )}

        {/* Icon circle */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
          style={{ background: isDone || isActive ? stage.hex : '#e2e8f0' }}>
          <Icon size={22} color="white" />
        </div>

        {/* Label */}
        <div className="text-center">
          <p className="text-sm font-black tracking-tight"
            style={{ color: isDone || isActive ? '#0f172a' : '#94a3b8' }}>
            {stage.label}
          </p>
          <p className="text-[9px] font-medium mt-0.5 leading-tight max-w-[110px] text-center"
            style={{ color: isDone || isActive ? '#64748b' : '#cbd5e1' }}>
            {stage.sub}
          </p>
        </div>

        {/* Count badge */}
        {loanCount > 0 && (
          <div className="px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md"
            style={{ background: stage.hex }}>
            {loanCount} pengajuan
          </div>
        )}

        {/* Done checkmark */}
        {isDone && loanCount === 0 && (
          <CheckCircle size={14} color={stage.hex} />
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: stage.hex }} />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: stage.hex }}>Aktif</span>
          </div>
        )}
      </div>

      {/* Reject path (for admin nodes) */}
      {(stage.step === 2 || stage.step === 3 || stage.step === 4) && (
        <RejectBadge />
      )}
    </div>
  );
}

/* ─── Main Approval Flow Diagram ───────────────────────────── */
export function ApprovalFlowDiagram({ loans = [], activeStatus = null }) {
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Count loans per stage
  const countPerStage = STAGES.reduce((acc, s) => {
    acc[s.id] = loans.filter(l => l.status === s.id).length;
    return acc;
  }, {});

  const currentStep = activeStatus ? getStage(activeStatus).step : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-1 rounded-full bg-[#005bb7]" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Alur Persetujuan Pinjaman</span>
      </div>

      {/* Diagram Container */}
      <div className="bg-white/50 backdrop-blur-2xl border border-white rounded-[2.5rem] p-10 shadow-[0_15px_50px_rgba(0,0,0,0.03)] overflow-x-auto">
        {/* Main Flow Row */}
        <div className="flex items-center justify-center gap-0 min-w-max mx-auto">
          {STAGES.map((stage, i) => {
            const isDone   = currentStep ? stage.step < currentStep : false;
            const isActive = currentStep ? stage.step === currentStep : false;
            const loanCnt  = countPerStage[stage.id] || 0;

            return (
              <React.Fragment key={stage.id}>
                <DiagramNode
                  stage={stage}
                  isActive={isActive || loanCnt > 0}
                  isDone={isDone}
                  isLast={i === STAGES.length - 1}
                  loanCount={loanCnt}
                />
                {i < STAGES.length - 1 && (
                  <Arrow
                    color={stage.hex}
                    active={isDone || loanCnt > 0}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Reject / Revision path */}
        <div className="mt-14 flex justify-center">
          <div className="flex items-center gap-3 px-6 py-3 bg-red-50 border border-red-100 rounded-2xl">
            <AlertCircle size={16} className="text-red-400" />
            <div>
              <p className="text-xs font-black text-red-500 uppercase tracking-widest">Jalur Penolakan</p>
              <p className="text-[10px] text-red-400 font-medium mt-0.5">
                Jika Admin 1, 2, atau 3 menolak → pengajuan kembali ke pemohon untuk revisi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan list per stage (if loans exist) */}
      {loans.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map(stage => {
            const stageLoans = loans.filter(l => l.status === stage.id);
            if (stageLoans.length === 0) return null;
            return (
              <div key={stage.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest"
                  style={{ background: stage.light, borderColor: stage.border, color: stage.hex }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: stage.hex }} />
                  {stage.label}
                </div>
                {stageLoans.map(loan => (
                  <button
                    key={loan.id}
                    onClick={() => setSelectedLoan(loan)}
                    className="text-left bg-white/80 border rounded-xl px-3 py-2.5 hover:shadow-md transition-all duration-300 group"
                    style={{ borderColor: stage.border }}
                  >
                    <p className="text-xs font-black text-slate-800 truncate">{loan.user?.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{fmtCurrency(loan.amount)}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <ChevronRight size={10} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" style={{ color: stage.hex }} />
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: stage.hex }}>Detail</span>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedLoan && (
        <LoanDetailModal loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
      )}
    </div>
  );
}

/* ─── Loan Detail Modal with vertical timeline ──────────────── */
function LoanDetailModal({ loan, onClose }) {
  const currentStage = getStage(loan.status);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] w-full max-w-lg border border-white overflow-hidden">
        {/* Header */}
        <div className="p-8 flex justify-between items-start border-b border-slate-100"
          style={{ background: currentStage.light }}>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Tracking Pengajuan</p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{loan.user?.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{fmtCurrency(loan.amount)} &bull; {loan.tenor} Bulan</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 text-slate-400 hover:bg-white hover:text-slate-700 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Vertical Timeline */}
        <div className="p-8 flex flex-col gap-0">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const curStep = currentStage.step;
            const isDone = stage.step < curStep;
            const isActive = stage.step === curStep;
            return (
              <div key={stage.id} className="flex gap-4 relative">
                {/* Line */}
                {i < STAGES.length - 1 && (
                  <div className="absolute left-[18px] top-9 w-0.5 h-10 rounded-full"
                    style={{ background: isDone ? stage.hex : '#f1f5f9' }} />
                )}
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-500"
                  style={{
                    background: isDone || isActive ? stage.hex : '#f1f5f9',
                    boxShadow: isActive ? `0 4px 14px ${stage.hex}55` : 'none',
                  }}>
                  <Icon size={16} color={isDone || isActive ? 'white' : '#cbd5e1'} />
                </div>
                {/* Content */}
                <div className="pb-10 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-black ${isDone || isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                      {stage.label}
                    </p>
                    {isDone && <span className="text-[9px] font-black px-2 py-0.5 rounded-lg text-white" style={{ background: stage.hex }}>✓ Selesai</span>}
                    {isActive && <span className="text-[9px] font-black px-2 py-0.5 rounded-lg text-white animate-pulse" style={{ background: stage.hex }}>● Menunggu</span>}
                  </div>
                  <p className={`text-[11px] mt-0.5 ${isDone || isActive ? 'text-slate-400' : 'text-slate-200'}`}>{stage.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-8 pb-8">
          <button onClick={onClose} className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all"
            style={{ background: currentStage.hex }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mini Tracker (table rows) ─────────────────────────────── */
export function MiniTracker({ status }) {
  const curStep = getStage(status).step;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-0.5">
        {STAGES.map((s, i) => {
          const done = curStep > s.step;
          const active = curStep === s.step;
          return (
            <React.Fragment key={s.id}>
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black transition-all duration-500"
                style={{
                  background: done ? s.hex : active ? s.light : '#f1f5f9',
                  border: active ? `2px solid ${s.hex}` : done ? 'none' : '1px solid #e2e8f0',
                  color: done ? 'white' : active ? s.hex : '#cbd5e1',
                  boxShadow: active ? `0 0 0 3px ${s.hex}22` : 'none',
                }}>
                {done ? '✓' : s.step}
              </div>
              {i < STAGES.length - 1 && (
                <div className="flex-1 h-px rounded-full transition-all duration-500"
                  style={{ background: done ? s.hex : '#f1f5f9' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <span className="text-[10px] font-bold text-slate-500">
        {getStage(status).label} — {getStage(status).sub}
      </span>
    </div>
  );
}

/* ─── WorkflowBanner alias ───────────────────────────────────── */
export function WorkflowBanner({ loans = [] }) {
  return <ApprovalFlowDiagram loans={loans} />;
}
