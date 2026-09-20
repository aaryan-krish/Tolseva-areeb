import React from 'react';
import { 
  X, 
  Building2, 
  Scale, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  FileText, 
  CheckCircle2, 
  QrCode,
  Download,
  AlertOctagon
} from 'lucide-react';
import { InspectionSchedule, Instrument } from '../../types';

interface InspectionCaseDetailModalProps {
  schedule: InspectionSchedule;
  instrument?: Instrument;
  isOpen: boolean;
  onClose: () => void;
  onOpenPublicQr?: (instrumentId: string) => void;
}

export const InspectionCaseDetailModal: React.FC<InspectionCaseDetailModalProps> = ({
  schedule,
  instrument,
  isOpen,
  onClose,
  onOpenPublicQr,
}) => {
  if (!isOpen) return null;

  const isUrgent = schedule.priority === 'Urgent Re-Audit';
  const hasComplaints = (schedule.complaintCount || 0) > 0 || schedule.flagStatus === 'red' || schedule.flagStatus === 'yellow';

  // Format SLA status
  const now = Date.now();
  const due = schedule.dueTimestamp || now + 24 * 3600 * 1000;
  const diffHours = Math.round((due - now) / (3600 * 1000));
  const isOverdue = diffHours < 0;

  return (
    <div 
      id="case-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
    >
      <div 
        id="case-detail-modal-card"
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base tracking-tight">Case Details • {schedule.id}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isUrgent ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40' : 'bg-indigo-500/30 text-indigo-200'
                }`}>
                  {schedule.priority}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  schedule.status === 'Completed' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
                }`}>
                  {schedule.status}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Desktop Office Case File • Pre-Inspection Dossier
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs overflow-y-auto max-h-[75vh]">
          {/* SLA Deadline Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isOverdue 
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : diffHours < 24 
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-indigo-50 border-indigo-200 text-indigo-950'
          }`}>
            <div className="flex items-center gap-2.5">
              <Clock className={`w-5 h-5 shrink-0 ${isOverdue ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs">Statutory SLA Deadline:</span>
                  <span className="font-mono font-extrabold">{schedule.dueDate || '24 Sep 2026, 05:00 PM'}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isOverdue 
                    ? `⚠️ Breached! Overdue by ${Math.abs(diffHours)} hours under Legal Metrology SLA rules.`
                    : `Resolution window active: ${diffHours} hours remaining.`}
                </p>
              </div>
            </div>

            {schedule.triggeredByComplaint && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-600 text-white shadow-2xs">
                ⚠️ Citizen Complaint Triggered ({schedule.complaintCount || 2})
              </span>
            )}
          </div>

          {/* Trader & Shop Identification */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Merchant & Business Information</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Business Name</span>
                <span className="font-bold text-slate-900 text-xs">{schedule.businessName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Merchant Contact</span>
                <span className="font-semibold text-slate-800 text-xs">{schedule.vendorName}</span>
                <span className="text-[11px] text-slate-500 font-mono block">{schedule.contact}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">District & Jurisdiction</span>
                <span className="font-semibold text-slate-800 text-xs">{schedule.district}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-[10px] text-slate-400 block uppercase">Physical Counter Address</span>
                <span className="text-slate-700 text-xs">{schedule.shopLocation}</span>
              </div>
            </div>
          </div>

          {/* Machine & Metrological Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span>Machine Metrological Specifications</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Serial Number</span>
                <span className="font-mono font-bold text-indigo-700">{schedule.serialNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Category</span>
                <span className="font-semibold text-slate-800">{schedule.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Accuracy Class</span>
                <span className="font-bold text-indigo-900">{instrument?.accuracyClass || 'Class III (Medium)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Model Approval</span>
                <span className="font-mono text-slate-800">{instrument?.modelApprovalNumber || 'IND/09/2022/418'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Capacity</span>
                <span className="font-semibold text-slate-800">{instrument?.capacityKg || 30} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Verification (e)</span>
                <span className="font-semibold text-slate-800">{instrument?.verificationIntervalValue || 5} {instrument?.verificationIntervalUnit || 'g'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block uppercase">Rule 14 Stamped Identifier</span>
                <span className="font-mono font-bold text-amber-700">{instrument?.stampedIdentifier || 'OIML-IND-2026-FAC01-0042-M'}</span>
              </div>
            </div>
          </div>

          {/* Form-V Provisional Token & Statutory Fee Receipt */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Form-V Provisional Token & Statutory Fee Receipt</span>
              </h4>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Fee Paid: ₹{instrument?.feePaid || 650}.00 (UPI)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-emerald-900">
              <div>
                <span className="text-emerald-700 block text-[10px]">Payment ID:</span>
                <span className="font-mono font-semibold">{instrument?.paymentId || 'PAY-UPI-1192837'}</span>
              </div>
              <div>
                <span className="text-emerald-700 block text-[10px]">7-Day Token Expiry:</span>
                <span className="font-bold">{instrument?.provisionalTokenExpiry || '27 Sep 2026'}</span>
              </div>
              <div>
                <span className="text-emerald-700 block text-[10px]">Assigned Officer:</span>
                <span className="font-semibold">{schedule.assignedInspectorName || 'Officer Sunita Patil'}</span>
              </div>
            </div>
          </div>

          {/* Completed Audit / Verification Certification (If Completed) */}
          {schedule.status === 'Completed' && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Legal Metrology Certificate Details</span>
                </h4>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                  e-Certificate Issued
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-indigo-950">
                <div>
                  <span className="text-indigo-600 block text-[10px]">Certificate No:</span>
                  <span className="font-mono font-bold">{instrument?.eCertificateId || 'CERT-LM-2026-88192'}</span>
                </div>
                <div>
                  <span className="text-indigo-600 block text-[10px]">Hologram Sticker ID:</span>
                  <span className="font-mono font-bold text-amber-700">{instrument?.hologramStickerId || 'HOL-MH-88192'}</span>
                </div>
                <div>
                  <span className="text-indigo-600 block text-[10px]">QR Security Hash:</span>
                  <span className="font-mono text-slate-700 truncate block">SHA256-CERT-OK</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Field audits must be conducted using the <strong>Inspector Mobile Tool</strong>.
          </div>

          <div className="flex items-center gap-2">
            {onOpenPublicQr && (
              <button
                type="button"
                onClick={() => onOpenPublicQr(schedule.instrumentId)}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>View Public QR Page</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
