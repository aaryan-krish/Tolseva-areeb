import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  ShieldCheck, 
  QrCode, 
  Sparkles, 
  Plus, 
  Trash2, 
  Loader2,
  FileCheck,
  Award,
  Printer,
  ExternalLink
} from 'lucide-react';
import { Instrument, AccuracyTestStep, InspectionSchedule } from '../../types';
import { useTolSeva } from '../../context/TolSevaContext';
import { HologramStickerModal } from '../vendor/HologramStickerModal';
import { PublicVerificationModal } from '../common/PublicVerificationModal';
import confetti from 'canvas-confetti';

interface AccuracyTestModalProps {
  instrument: Instrument;
  schedule?: InspectionSchedule | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AccuracyTestModal: React.FC<AccuracyTestModalProps> = ({
  instrument,
  schedule,
  isOpen,
  onClose,
}) => {
  const { completeAccuracyTest } = useTolSeva();
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);

  // Test steps state
  const [testSteps, setTestSteps] = useState<AccuracyTestStep[]>([
    {
      testLoadKg: 1.0,
      observedWeightKg: 1.0,
      errorGm: 0,
      maxPermissibleErrorGm: 2.0,
      isPassed: true,
    },
    {
      testLoadKg: 5.0,
      observedWeightKg: 5.002,
      errorGm: 2.0,
      maxPermissibleErrorGm: 5.0,
      isPassed: true,
    },
    {
      testLoadKg: 15.0,
      observedWeightKg: 15.004,
      errorGm: 4.0,
      maxPermissibleErrorGm: 10.0,
      isPassed: true,
    },
  ]);

  const [inspectorRemarks, setInspectorRemarks] = useState(
    'Instrument tested using certified NPL Class M1 standard reference weights. Load cell linearity and repeatability within statutory tolerances. Digital lead wire seal affixed.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedRecord, setIssuedRecord] = useState<any>(null);

  // Helper to re-evaluate step
  const handleStepChange = (index: number, field: keyof AccuracyTestStep, val: number) => {
    setTestSteps(prev => {
      const updated = [...prev];
      const step = { ...updated[index], [field]: val };

      // Calculate error in grams
      if (field === 'testLoadKg' || field === 'observedWeightKg') {
        const diffKg = step.observedWeightKg - step.testLoadKg;
        step.errorGm = Math.round(diffKg * 1000 * 100) / 100;

        // Auto tolerance check
        step.isPassed = Math.abs(step.errorGm) <= step.maxPermissibleErrorGm;
      } else if (field === 'maxPermissibleErrorGm') {
        step.isPassed = Math.abs(step.errorGm) <= step.maxPermissibleErrorGm;
      }

      updated[index] = step;
      return updated;
    });
  };

  const handleAddStep = () => {
    const nextLoad = (testSteps[testSteps.length - 1]?.testLoadKg || 1) * 2;
    setTestSteps(prev => [
      ...prev,
      {
        testLoadKg: nextLoad,
        observedWeightKg: nextLoad,
        errorGm: 0,
        maxPermissibleErrorGm: nextLoad > 10 ? 10 : 5,
        isPassed: true,
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (testSteps.length <= 1) return;
    setTestSteps(prev => prev.filter((_, i) => i !== index));
  };

  const isAllPassed = testSteps.every(s => s.isPassed);

  const handleSubmitVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const record = completeAccuracyTest(
        instrument.id,
        schedule?.id || null,
        testSteps,
        inspectorRemarks
      );

      setIssuedRecord(record);

      if (record.overallResult === 'PASS') {
        // Trigger celebratory canvas-confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#6366F1', '#F59E0B', '#3B82F6'],
        });
      }
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-6 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                Digital Verification & Accuracy Test Studio
              </h3>
              <p className="text-xs text-indigo-200">
                Official Metrology Field Tooling • Legal Tolerances (Seventh Schedule)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          {issuedRecord ? (
            /* Result Success / e-Certificate Generation View */
            <div className="text-center py-6 space-y-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ring-8 ${
                  issuedRecord.overallResult === 'PASS'
                    ? 'bg-emerald-100 text-emerald-700 ring-emerald-50'
                    : 'bg-rose-100 text-rose-700 ring-rose-50'
                }`}
              >
                {issuedRecord.overallResult === 'PASS' ? (
                  <CheckCircle2 className="w-12 h-12" />
                ) : (
                  <AlertTriangle className="w-12 h-12" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Verification Protocol Concluded
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {issuedRecord.overallResult === 'PASS'
                    ? 'e-Certificate & Hologram QR Sticker Issued'
                    : 'Instrument Rejected — Notice of Rectification Dispatched'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  {issuedRecord.overallResult === 'PASS'
                    ? 'The scale complies fully with Legal Metrology Act accuracy tolerances. 1-Year verification validity applied.'
                    : 'Errors exceeded Maximum Permissible Error limits. Machine has been temporarily locked from trade.'}
                </p>
              </div>

              {/* Dynamic Holographic Sticker Simulation */}
              {issuedRecord.overallResult === 'PASS' && (
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-2xl p-6 max-w-md mx-auto border-2 border-indigo-400/40 shadow-xl relative overflow-hidden text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-xs">
                        LM
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                          Govt. of India • Metrology Seal
                        </p>
                        <p className="text-xs font-bold text-white">DIGITAL E-STAMP & QR</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                      CLASS III VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-300 text-[11px]">
                        Cert No: <span className="font-mono text-white font-bold">{issuedRecord.eCertificateNo}</span>
                      </p>
                      <p className="text-slate-300 text-[11px]">
                        Sticker ID: <span className="font-mono text-amber-300 font-bold">{issuedRecord.hologramStickerId}</span>
                      </p>
                      <p className="text-slate-300 text-[11px]">
                        Inspector: <span className="text-white font-semibold">{issuedRecord.inspectorName}</span>
                      </p>
                      <p className="text-emerald-400 text-[11px] font-semibold">
                        Valid Until: {issuedRecord.validUntil}
                      </p>
                    </div>

                    <div className="w-20 h-20 bg-white rounded-xl p-2 flex flex-col items-center justify-center shrink-0">
                      <QrCode className="w-14 h-14 text-slate-900" />
                      <span className="text-[7px] text-slate-900 font-bold">SCAN AUDIT</span>
                    </div>
                  </div>

                  {/* QR Sticker & Public Web Actions */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setIsStickerModalOpen(true)}
                      className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Scale QR Sticker</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublicModalOpen(true)}
                      className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Simulate Consumer Scan</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Close & Return to Schedules
                </button>
              </div>
            </div>
          ) : (
            /* Digital Accuracy Test Form */
            <>
              {/* Instrument & Merchant Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Instrument ID</span>
                  <span className="font-mono font-bold text-slate-900">{instrument.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Accuracy Class</span>
                  <span className="font-bold text-indigo-700">{instrument.accuracyClass}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Serial Number</span>
                  <span className="font-mono text-slate-800">{instrument.serialNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Trader Name</span>
                  <span className="font-semibold text-slate-900">{instrument.vendorName}</span>
                </div>
              </div>

              {/* Accuracy Test Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Standard Test Load vs Observed Scale Readout
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Record test weights from calibrated secondary standard weight box.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Load Test</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Standard Load (kg)</th>
                        <th className="py-2.5 px-3">Observed Reading (kg)</th>
                        <th className="py-2.5 px-3">Error (grams)</th>
                        <th className="py-2.5 px-3">MPE Limit (±g)</th>
                        <th className="py-2.5 px-3 text-center">Result</th>
                        <th className="py-2.5 px-2 text-center">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {testSteps.map((step, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <input
                              type="number"
                              step="0.001"
                              value={step.testLoadKg}
                              onChange={(e) => handleStepChange(idx, 'testLoadKg', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              step="0.001"
                              value={step.observedWeightKg}
                              onChange={(e) => handleStepChange(idx, 'observedWeightKg', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                            />
                          </td>
                          <td className="p-2.5 font-mono font-bold">
                            <span className={step.errorGm === 0 ? 'text-slate-600' : step.errorGm > 0 ? 'text-amber-600' : 'text-blue-600'}>
                              {step.errorGm > 0 ? `+${step.errorGm}` : step.errorGm} g
                            </span>
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              step="0.1"
                              value={step.maxPermissibleErrorGm}
                              onChange={(e) => handleStepChange(idx, 'maxPermissibleErrorGm', parseFloat(e.target.value) || 1)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                            />
                          </td>
                          <td className="p-2.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                step.isPassed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {step.isPassed ? 'PASS' : 'FAIL'}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveStep(idx)}
                              disabled={testSteps.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  isAllPassed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isAllPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold block">
                      Overall Compliance Decision: {isAllPassed ? 'STATUTORY PASS' : 'STATUTORY TOLERANCE BREACH'}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {isAllPassed
                        ? 'All test loads remain within statutory MPE limits. Ready for holographic QR sticker generation.'
                        : 'One or more test loads exceed permitted error. Re-calibration required before e-Certificate issuance.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inspector Remarks & Physical Seal Log */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                  Inspector Audit Remarks & Seal Registration
                </label>
                <textarea
                  rows={3}
                  value={inspectorRemarks}
                  onChange={(e) => setInspectorRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none text-slate-800"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmitVerification}
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 text-white transition shadow-sm ${
                    isAllPassed
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Writing to Blockchain / Legal Metrology Ledger...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>
                        {isAllPassed
                          ? 'Issue e-Certificate & Hologram QR Sticker'
                          : 'Record Failure & Issue Correction Notice'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isStickerModalOpen && (
        <HologramStickerModal
          instrument={instrument}
          isOpen={isStickerModalOpen}
          onClose={() => setIsStickerModalOpen(false)}
          onOpenPublicVerification={() => {
            setIsStickerModalOpen(false);
            setIsPublicModalOpen(true);
          }}
        />
      )}

      {isPublicModalOpen && (
        <PublicVerificationModal
          isOpen={isPublicModalOpen}
          initialInstrumentId={instrument.id}
          onClose={() => setIsPublicModalOpen(false)}
        />
      )}
    </div>
  );
};
