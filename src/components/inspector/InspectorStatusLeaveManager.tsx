import React, { useState } from 'react';
import { 
  UserCheck, 
  UserX, 
  Calendar, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useTolSeva } from '../../context/TolSevaContext';

export const InspectorStatusLeaveManager: React.FC = () => {
  const { inspectorAttendance, inspectorLeaveRecord, setInspectorStatus } = useTolSeva();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState<'Casual Leave' | 'Sick Leave' | 'Official Duty / Court Hearing' | 'Training' | 'Other'>('Casual Leave');
  const [startDate, setStartDate] = useState('2026-09-22');
  const [endDate, setEndDate] = useState('2026-09-25');

  const handleToggleClick = (target: 'active' | 'on_leave') => {
    if (target === 'active') {
      setInspectorStatus('active');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setInspectorStatus('on_leave', {
      leaveReason,
      startDate,
      endDate,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Inspector Status & Leave Manager Widget */}
      <div 
        id="inspector-status-leave-widget"
        className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/15 flex items-center gap-3 text-xs"
      >
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-300" />
            Duty Status
          </span>
          <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
            {inspectorAttendance === 'active' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300">Active / On Duty</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="text-rose-300">On Leave / Unavailable</span>
              </>
            )}
          </span>
        </div>

        {/* Quick Toggle Buttons */}
        <div className="flex items-center bg-slate-900/60 p-1 rounded-lg border border-white/10">
          <button
            type="button"
            id="inspector-status-active-btn"
            onClick={() => handleToggleClick('active')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
              inspectorAttendance === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Active</span>
          </button>

          <button
            type="button"
            id="inspector-status-leave-btn"
            onClick={() => handleToggleClick('on_leave')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
              inspectorAttendance === 'on_leave'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserX className="w-3 h-3" />
            <span>On Leave</span>
          </button>
        </div>
      </div>

      {/* Leave Application Modal */}
      {isModalOpen && (
        <div 
          id="leave-application-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div 
            id="leave-application-modal-card"
            className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Inspector Leave Application</h4>
                  <p className="text-[10px] text-rose-200">Legal Metrology Field Directorate</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="p-5 space-y-4 text-xs">
              {/* Auto-Reassignment Warning Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Notice:</strong> All pending visits for this period will be flagged for re-routing by the Higher Authority Admin.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Reason for Absence
                </label>
                <select
                  id="leave-reason-select"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Official Duty / Court Hearing">Official Duty / Court Hearing (Sec 30 Prosecution)</option>
                  <option value="Training">Training / National Physical Laboratory (NPL) Workshop</option>
                  <option value="Other">Other Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="leave-start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="leave-end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="confirm-leave-submit-btn"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UserX className="w-4 h-4" />
                  <span>Submit & Mark Unavailable</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
