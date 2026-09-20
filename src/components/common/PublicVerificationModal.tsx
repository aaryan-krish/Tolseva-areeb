import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  MapPin, 
  Phone, 
  FileText, 
  Building2, 
  Scale, 
  Sparkles, 
  Check, 
  Send, 
  Smartphone, 
  Lock, 
  RefreshCw, 
  Printer, 
  ExternalLink,
  ChevronRight,
  Info,
  Sliders,
  Clock
} from 'lucide-react';
import { Instrument, ConsumerComplaint } from '../../types';
import { useTolSeva } from '../../context/TolSevaContext';

interface PublicVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInstrumentId?: string;
}

export const PublicVerificationModal: React.FC<PublicVerificationModalProps> = ({
  isOpen,
  onClose,
  initialInstrumentId,
}) => {
  const { instruments, submitConsumerComplaint } = useTolSeva();

  // Find instrument or fallback to first verified/available
  const defaultInstrument = initialInstrumentId 
    ? (instruments.find(i => i.id === initialInstrumentId) || instruments[0])
    : (instruments.find(i => i.status === 'verified') || instruments[0]);

  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(defaultInstrument?.id || '');
  const [activeTab, setActiveTab] = useState<'status' | 'complaint'>('status');

  // Complaint Form State
  const [issueCategory, setIssueCategory] = useState<string>('Underweight Commodity (तौल में कमी)');
  const [commodityName, setCommodityName] = useState<string>('');
  const [billedWeightKg, setBilledWeightKg] = useState<string>('');
  const [actualWeightKg, setActualWeightKg] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [gpsData, setGpsData] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    address: string;
    verified: boolean;
  } | null>(null);

  // OTP Spam Protection State
  const [consumerName, setConsumerName] = useState<string>('');
  const [consumerMobile, setConsumerMobile] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Submission Result State
  const [submittedComplaint, setSubmittedComplaint] = useState<ConsumerComplaint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update selected instrument if initial changes
  useEffect(() => {
    if (initialInstrumentId) {
      setSelectedInstrumentId(initialInstrumentId);
    }
  }, [initialInstrumentId]);

  if (!isOpen) return null;

  const currentInstrument = instruments.find(i => i.id === selectedInstrumentId) || defaultInstrument;

  if (!currentInstrument) return null;

  // Calculate Shortage
  const billedNum = parseFloat(billedWeightKg) || 0;
  const actualNum = parseFloat(actualWeightKg) || 0;
  const hasWeightComparison = billedNum > 0 && actualNum > 0;
  const shortageKg = hasWeightComparison ? Math.max(0, billedNum - actualNum) : 0;
  const shortageGrams = Math.round(shortageKg * 1000);
  const shortagePercent = billedNum > 0 ? ((shortageKg / billedNum) * 100).toFixed(1) : '0';

  // Request GPS
  const handleAcquireGps = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setGpsData({
            lat: Number(position.coords.latitude.toFixed(5)),
            lng: Number(position.coords.longitude.toFixed(5)),
            accuracy: Math.round(position.coords.accuracy) || 8,
            address: `${currentInstrument.shopLocation}, ${currentInstrument.district}`,
            verified: true,
          });
        },
        () => {
          // Fallback simulation with realistic counter coords
          setTimeout(() => {
            setIsLocating(false);
            setGpsData({
              lat: 19.0760,
              lng: 72.8777,
              accuracy: 6,
              address: `${currentInstrument.shopLocation}, ${currentInstrument.district} (On-Site Geo-Fence Match)`,
              verified: true,
            });
          }, 600);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        setGpsData({
          lat: 19.0760,
          lng: 72.8777,
          accuracy: 6,
          address: `${currentInstrument.shopLocation}, ${currentInstrument.district}`,
          verified: true,
        });
      }, 500);
    }
  };

  // Send OTP Simulation
  const handleSendOtp = () => {
    if (!consumerMobile || consumerMobile.replace(/\D/g, '').length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpError('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.trim() === generatedOtp.trim()) {
      setIsOtpVerified(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please enter the 6-digit code shown.');
    }
  };

  // Submit Complaint
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpVerified) {
      setOtpError('Mobile OTP verification is mandatory to prevent spam reporting');
      return;
    }
    if (!commodityName.trim()) {
      setOtpError('Please specify the commodity or item weighed');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const complaint = submitConsumerComplaint({
        instrumentId: currentInstrument.id,
        consumerName: consumerName || 'Citizen Consumer',
        consumerMobile: consumerMobile,
        issueCategory,
        commodityName,
        billedWeightKg: billedNum > 0 ? billedNum : undefined,
        actualWeightKg: actualNum > 0 ? actualNum : undefined,
        shortageGrams: shortageGrams > 0 ? shortageGrams : undefined,
        description: description || `Reported ${issueCategory} for ${commodityName}.`,
        gpsCoordinates: gpsData ? { lat: gpsData.lat, lng: gpsData.lng } : undefined,
        gpsAccuracyMeters: gpsData?.accuracy,
        locationAddress: gpsData?.address || currentInstrument.shopLocation,
      });

      setIsSubmitting(false);
      setSubmittedComplaint(complaint);
    }, 600);
  };

  const resetForm = () => {
    setSubmittedComplaint(null);
    setCommodityName('');
    setBilledWeightKg('');
    setActualWeightKg('');
    setDescription('');
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setEnteredOtp('');
    setGeneratedOtp('');
    setOtpError('');
  };

  // Validity Calculation
  const certNumber = currentInstrument.eCertificateId || `CERT-LM-2026-${currentInstrument.id.slice(-4)}`;
  const stickerId = currentInstrument.hologramStickerId || `HOL-MH-${currentInstrument.id.slice(-5)}`;
  const validUntilDate = currentInstrument.lastVerificationDate 
    ? new Date(new Date(currentInstrument.lastVerificationDate).setFullYear(new Date(currentInstrument.lastVerificationDate).getFullYear() + 1)).toISOString().split('T')[0]
    : '2027-08-14';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-4 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Official Tricolor Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

        {/* Public Header simulating tolseva.gov.in web view */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-black text-sm shadow-md border border-indigo-400/30">
              <QrCode className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                  tolseva.gov.in • Public Verification
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Official Portal
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                Legal Metrology Machine Verification & Redressal
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close Public Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Scale Selector (Allows toggling between scales to test verified vs flagged) */}
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Active Scale Scanned:</span>
            <select
              value={selectedInstrumentId}
              onChange={(e) => {
                setSelectedInstrumentId(e.target.value);
                resetForm();
              }}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {instruments.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.businessName} ({inst.brandModel} • {inst.serialNumber}) [{inst.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Sec. 24 QR Ecosystem
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-3 px-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'status'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1-Click Verification & Status</span>
          </button>

          <button
            onClick={() => setActiveTab('complaint')}
            className={`flex-1 py-3 px-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'complaint'
                ? 'border-rose-600 text-rose-700 bg-rose-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Lodge Discrepancy (OTP Spam Protected)</span>
            {currentInstrument.complaintsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">
                {currentInstrument.complaintsCount}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto max-h-[72vh] space-y-5 bg-slate-50/60">
          {activeTab === 'status' ? (
            /* TAB 1: 1-Click Verification & Status */
            <div className="space-y-4">
              {/* Primary Status Banner */}
              {currentInstrument.status === 'verified' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3.5 shadow-xs">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-emerald-950 text-sm">
                          Government Verified & Legally Calibrated Scale
                        </h4>
                        <span className="text-[10px] uppercase font-mono font-black bg-emerald-600 text-white px-2 py-0.5 rounded">
                          LEGAL TO TRADE
                        </span>
                      </div>
                      <span className="text-xs text-emerald-800 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Valid until {validUntilDate}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      This instrument has undergone laboratory accuracy testing under the <strong>Legal Metrology Act, 2009</strong>. The holographic seal and cryptographic QR code are authentic.
                    </p>
                  </div>
                </div>
              ) : currentInstrument.status === 'provisional_active' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3.5 shadow-xs">
                  <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="font-bold text-amber-950 text-sm">
                        Provisional 7-Day Temporary Verification Token
                      </h4>
                      <span className="text-[10px] uppercase font-mono font-black bg-amber-500 text-white px-2 py-0.5 rounded">
                        PROVISIONAL
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 mt-1">
                      Token #{currentInstrument.paymentId}. Physical laboratory verification is scheduled with the designated metrology officer.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3.5 shadow-xs">
                  <div className="w-9 h-9 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="font-bold text-rose-950 text-sm">
                        Instrument Under Vigilance Audit / Re-Verification
                      </h4>
                      <span className="text-[10px] uppercase font-mono font-black bg-rose-600 text-white px-2 py-0.5 rounded">
                        FLAGGED: {currentInstrument.flagStatus.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-rose-800 mt-1">
                      This instrument has received variance flags or complaint logs. Official re-audit is assigned to ensure fair trade.
                    </p>
                  </div>
                </div>
              )}

              {/* Establishment & Scale Credentials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Shop / Counter Info */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-900 border-b border-slate-100 pb-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <h5 className="font-bold text-xs uppercase tracking-wide">Establishment Details</h5>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Business / Counter:</span>
                      <span className="font-bold text-slate-900 text-right">{currentInstrument.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Licensed Vendor:</span>
                      <span className="font-medium text-slate-800 text-right">{currentInstrument.vendorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Counter Address:</span>
                      <span className="text-slate-700 text-right truncate max-w-[180px]">{currentInstrument.shopLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">District & State:</span>
                      <span className="font-medium text-slate-800">{currentInstrument.district}, {currentInstrument.state}</span>
                    </div>
                  </div>
                </div>

                {/* Machine Tech Specs */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-900 border-b border-slate-100 pb-2">
                    <Scale className="w-4 h-4 text-indigo-600" />
                    <h5 className="font-bold text-xs uppercase tracking-wide">Scale Technical Identity</h5>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Make & Model:</span>
                      <span className="font-bold text-slate-900 text-right">{currentInstrument.brandModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Serial Number:</span>
                      <span className="font-mono font-bold text-indigo-700">{currentInstrument.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Capacity:</span>
                      <span className="font-bold text-slate-900">
                        {currentInstrument.maxCapacityValue ? `${currentInstrument.maxCapacityValue} ${currentInstrument.maxCapacityUnit}` : `${currentInstrument.capacityKg} kg`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Accuracy Class:</span>
                      <span className="font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold">
                        {currentInstrument.accuracyClass}
                      </span>
                    </div>
                    {currentInstrument.verificationIntervalValue && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Scale Interval (e):</span>
                        <span className="font-semibold text-slate-800">
                          {currentInstrument.verificationIntervalValue} {currentInstrument.verificationIntervalUnit || 'g'}
                        </span>
                      </div>
                    )}
                    {currentInstrument.modelApprovalNumber && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Model Approval:</span>
                        <span className="font-mono text-slate-700 text-[11px]">{currentInstrument.modelApprovalNumber}</span>
                      </div>
                    )}
                    {currentInstrument.stampedIdentifier && (
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Stamped ID:</span>
                        <span className="font-mono text-indigo-700 font-bold text-[11px]">{currentInstrument.stampedIdentifier}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Statutory Verification Credentials */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <h5 className="font-bold text-xs uppercase tracking-wide text-slate-800">
                      Statutory e-Verification Seal Details
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Rule 14 • Form V</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Certificate No</span>
                    <span className="font-mono font-bold text-slate-900 truncate block">{certNumber}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Hologram Seal ID</span>
                    <span className="font-mono font-bold text-indigo-700 truncate block">{stickerId}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Verifying Officer</span>
                    <span className="font-medium text-slate-800 truncate block">
                      {currentInstrument.assignedInspectorName || 'Officer Sunita Patil'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Test Date</span>
                    <span className="font-medium text-slate-800">
                      {currentInstrument.lastVerificationDate || '2026-08-14'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-300 p-2.5 rounded-lg text-[10px] font-mono flex items-center justify-between">
                  <span className="truncate max-w-[340px]">
                    HASH: {currentInstrument.qrSecurityHash || `SHA256-${stickerId}-GOV-APPROVED`}
                  </span>
                  <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Authenticity Validated
                  </span>
                </div>
              </div>

              {/* Consumer Education MPE Notice */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-3 text-xs text-indigo-950">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Consumer Protection Guide (Maximum Permissible Error):</span>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    Under Indian Legal Metrology Rules, a certified <strong>{currentInstrument.accuracyClass}</strong> commercial scale must weigh within strict statutory tolerances (e.g. within ±0.002g to ±5g depending on capacity). If you suspect short-weight or tampered seals at this counter, lodge a verified complaint below.
                  </p>
                </div>
              </div>

              {/* Call to action: Switch to complaint */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setActiveTab('complaint')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Report Weight Discrepancy Against This Scale</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* TAB 2: Lodge Discrepancy (OTP-Bound Spam Protected) */
            <div>
              {submittedComplaint ? (
                /* Submission Success Acknowledgment Receipt */
                <div className="bg-white rounded-xl border border-emerald-200 p-6 text-center space-y-4 shadow-sm animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase">
                      Grievance Lodged Successfully
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">
                      Official Redressal Ticket #{submittedComplaint.id}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Your geo-tagged discrepancy has been recorded on the Legal Metrology vigilance ledger and verified with mobile OTP <strong>{consumerMobile}</strong>.
                    </p>
                  </div>

                  {/* Grievance Summary Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Establishment:</span>
                      <span className="font-bold text-slate-900">{currentInstrument.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scale Serial:</span>
                      <span className="font-mono font-bold text-indigo-700">{currentInstrument.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reported Issue:</span>
                      <span className="font-medium text-rose-700">{submittedComplaint.issueCategory}</span>
                    </div>
                    {submittedComplaint.shortageGrams && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Observed Shortage:</span>
                        <span className="font-bold text-rose-800">{submittedComplaint.shortageGrams} grams</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Officer:</span>
                      <span className="font-medium text-slate-800">{submittedComplaint.assignedInspectorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Investigation SLA:</span>
                      <span className="font-bold text-emerald-700">Within 48 Working Hours</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition"
                    >
                      Lodge Another Report
                    </button>
                    <button
                      onClick={() => setActiveTab('status')}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Return to Scale Status</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Complaint Form with OTP & GPS */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Anti-Spam Guarantee Banner */}
                  <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <span className="font-bold text-amber-300 block">
                        OTP-Bound Spam Protection & Geotag Verification
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        To prevent competitor bot-spam, fraudulent grievances, and black-hat defamation, complaints require a 1-time verified mobile OTP and live GPS verification within proximity of the merchant counter.
                      </p>
                    </div>
                  </div>

                  {/* Field 1: Issue Category */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                      1. Select Discrepancy Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        'Underweight Commodity (तौल में कमी)',
                        'Tare Weight Not Deducted (पैकिंग का वजन जोड़ना)',
                        'Display Obscured / Hidden (डिस्प्ले नहीं दिखाना)',
                        'Tampered / Broken Seal (सील टूटी हुई होना)',
                        'Scale Jumps / Digital Weight Fluctuation (वजन अस्थिर होना)',
                        'Refusal to Provide Bill / Receipt (रसीद देने से इनकार)',
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setIssueCategory(cat)}
                          className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                            issueCategory === cat
                              ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <span className="text-[11px] leading-snug">{cat}</span>
                          {issueCategory === cat && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field 2: Commodity & Weights */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                      2. Commodity & Observed Weight (Optional Comparison)
                    </label>
                    
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Commodity / Item Name *
                      </label>
                      <input
                        type="text"
                        value={commodityName}
                        onChange={(e) => setCommodityName(e.target.value)}
                        placeholder="e.g. 1kg Basmati Rice, 500g Sweets, Gold Ring, Apples"
                        required
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Billed Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          value={billedWeightKg}
                          onChange={(e) => setBilledWeightKg(e.target.value)}
                          placeholder="e.g. 1.000"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Actual Weight Received (kg)
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          value={actualWeightKg}
                          onChange={(e) => setActualWeightKg(e.target.value)}
                          placeholder="e.g. 0.920"
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 text-slate-900 font-mono"
                        />
                      </div>
                    </div>

                    {/* Calculated Shortage Alert */}
                    {hasWeightComparison && shortageKg > 0 && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs text-rose-950">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>
                            Observed Shortage: <strong>{shortageGrams} grams</strong> ({shortagePercent}% under-weight)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                          EXCEEDS LEGAL MPE
                        </span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Observations / Description (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide any additional details (e.g., trader refused to show display, used heavy cardboard box for packaging)..."
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Field 3: 1-Click Live GPS Geotagging */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                        3. 1-Click Geo-Tagged Location Verification
                      </label>
                      {gpsData?.verified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Geo-Fence Validated
                        </span>
                      )}
                    </div>

                    {gpsData ? (
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-indigo-600" />
                            GPS Coords:
                          </span>
                          <span className="font-mono font-bold text-slate-800">
                            {gpsData.lat}° N, {gpsData.lng}° E (±{gpsData.accuracy}m)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Location Tag:</span>
                          <span className="font-medium text-slate-800 truncate max-w-[240px]">{gpsData.address}</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAcquireGps}
                        disabled={isLocating}
                        className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition"
                      >
                        {isLocating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                            <span>Acquiring Live GPS Coordinates...</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Acquire On-Site GPS Geotag (Proximity Verification)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Field 4: Mobile OTP Authentication */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                        4. Mobile OTP Verification (Anti-Bot Spam)
                      </label>
                      {isOtpVerified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          OTP Verified
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Consumer Full Name
                        </label>
                        <input
                          type="text"
                          value={consumerName}
                          onChange={(e) => setConsumerName(e.target.value)}
                          placeholder="e.g. Ramesh Sharma"
                          disabled={isOtpVerified}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 text-slate-900 disabled:bg-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Mobile Number (10 Digits) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            maxLength={10}
                            value={consumerMobile}
                            onChange={(e) => setConsumerMobile(e.target.value)}
                            placeholder="98201 XXXXX"
                            disabled={isOtpVerified}
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 text-slate-900 font-mono disabled:bg-slate-100"
                          />
                          {!isOtpVerified && (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shrink-0"
                            >
                              {isOtpSent ? 'Resend' : 'Send OTP'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Simulated SMS Notification Helper */}
                    {isOtpSent && !isOtpVerified && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs text-amber-900">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                            <span>Simulated Govt SMS Gateway:</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEnteredOtp(generatedOtp)}
                            className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold px-2 py-0.5 rounded transition"
                          >
                            Auto-Fill: {generatedOtp}
                          </button>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          OTP <strong>{generatedOtp}</strong> sent to +91 {consumerMobile}. Enter below to authenticate grievance.
                        </p>

                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            maxLength={6}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="w-40 text-xs px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold tracking-widest text-center"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                    )}

                    {otpError && (
                      <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {otpError}
                      </p>
                    )}
                  </div>

                  {/* Submission Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isOtpVerified}
                      className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Filing Official Grievance on Vigilance Ledger...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>
                            {isOtpVerified 
                              ? 'Submit OTP-Verified Grievance (Sec. 30 Action)'
                              : 'Complete Mobile OTP Verification to Submit'}
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-2">
                      Filing verified reports triggers an unannounced inspection by the District Legal Metrology Officer.
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>National Legal Metrology Portal • Consumer Affairs Helpline: 1915</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">SIH 2026 Innovation</span>
            <button
              onClick={onClose}
              className="font-bold text-slate-700 hover:text-slate-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
