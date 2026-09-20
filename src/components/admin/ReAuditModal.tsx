import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  UserCheck, 
  Send, 
  Building2, 
  Scale, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Instrument } from '../../types';
import { useTolSeva } from '../../context/TolSevaContext';

interface ReAuditModalProps {
  instrument: Instrument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReAuditModal: React.FC<ReAuditModalProps> = ({
  instrument,
  isOpen,
  onClose,
}) => {
  const { reassignReAudit } = useTolSeva();

  const [selectedInspector, setSelectedInspector] = useState({
    id: 'INS-PUN-312',
    name: 'Officer Mahendra Joshi (Special Anti-Fraud Flying Squad)',
  });
  const [priorityReason, setPriorityReason] = useState(
    'Re-assigned to external neutral vigilance division to prevent localized collusion following repeat consumer cheating reports.'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !instrument) return null;

  const handleReassign = (e: React.FormEvent) => {
    e.preventDefault();
    reassignReAudit(
      instrument.id,
      selectedInspector.id,
      selectedInspector.name,
      priorityReason
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const UNBIASED_INSPECTORS = [
    { id: 'INS-PUN-312', name: 'Officer Mahendra Joshi (Special Anti-Fraud Flying Squad)' },
    { id: 'INS-NGP-105', name: 'Officer K. Raman (Directorate Vigilance Cell)' },
    { id: 'INS-NSK-201', name: 'Officer P. Gaikwad (Central Surveillance Unit)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-rose-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Higher Authority Re-Audit Dispatch
              </h3>
              <p className="text-xs text-rose-200">
                Rule 28 Discretionary Audit Order • Neutral Inspector Assignment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Priority Re-Audit Order Dispatched</h4>
            <p className="text-xs text-slate-600">
              Independent vigilance inspector has been assigned. The trader will be inspected within 24 hours under geofenced monitoring.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReassign} className="p-6 space-y-4">
            {/* Instrument summary */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950 space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span>{instrument.businessName}</span>
                <span className="bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-mono text-[10px]">
                  {instrument.complaintsCount} Complaints (RED FLAG)
                </span>
              </div>
              <p className="text-rose-800 text-[11px]">
                {instrument.category} • Model: {instrument.brandModel} • S/N: {instrument.serialNumber}
              </p>
              <p className="text-rose-700 text-[11px]">
                Address: {instrument.shopLocation}, {instrument.district}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1">
                Assign Neutral Vigilance Inspector (Anti-Collusion Protocol)
              </label>
              <select
                value={selectedInspector.id}
                onChange={(e) => {
                  const target = UNBIASED_INSPECTORS.find(ins => ins.id === e.target.value);
                  if (target) setSelectedInspector(target);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-rose-600 font-semibold text-slate-900"
              >
                {UNBIASED_INSPECTORS.map(ins => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Assigns an officer from another zone to eliminate risk of local familiarity.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1">
                Official Re-Audit Directive & Statutory Grounding
              </label>
              <textarea
                rows={3}
                required
                value={priorityReason}
                onChange={(e) => setPriorityReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-rose-600 resize-none text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>Issue Binding Re-Audit Warrant</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
