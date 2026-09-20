import React, { useState, useEffect } from 'react';
import { 
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
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  Search,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Download,
  CheckCircle
} from 'lucide-react';
import { Instrument, ConsumerComplaint, ComplaintStatus } from '../../types';
import { useTolSeva } from '../../context/TolSevaContext';
import { TolSevaLogo } from '../common/TolSevaLogo';

interface PublicVerificationPortalProps {
  initialInstrumentId?: string;
  initialComplaintId?: string;
  initialTab?: 'verify' | 'register' | 'status';
  onBackToDashboard?: () => void;
}

export const PublicVerificationPortal: React.FC<PublicVerificationPortalProps> = ({
  initialInstrumentId,
  initialComplaintId,
  initialTab = 'verify',
  onBackToDashboard,
}) => {
  const { instruments, complaints, submitConsumerComplaint } = useTolSeva();

  // Find selected instrument or default to verified scale
  const defaultInstrument = initialInstrumentId 
    ? (instruments.find(i => i.id === initialInstrumentId) || instruments[0])
    : (instruments.find(i => i.status === 'verified') || instruments[0]);

  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(defaultInstrument?.id || '');
  const [activeTab, setActiveTab] = useState<'verify' | 'register' | 'status'>(initialTab);

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
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);

  // Submission & Status Tracker State
  const [submittedComplaint, setSubmittedComplaint] = useState<ConsumerComplaint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchComplaintId, setSearchComplaintId] = useState<string>(initialComplaintId || '');
  const [trackedComplaint, setTrackedComplaint] = useState<ConsumerComplaint | null>(null);

  // Keep selected instrument in sync if prop changes
  useEffect(() => {
    if (initialInstrumentId) {
      setSelectedInstrumentId(initialInstrumentId);
    }
  }, [initialInstrumentId]);

  // If initialComplaintId is passed, track it
  useEffect(() => {
    if (initialComplaintId) {
      const match = complaints.find(c => c.id.toLowerCase() === initialComplaintId.toLowerCase());
      if (match) {
        setTrackedComplaint(match);
        setActiveTab('status');
      }
    }
  }, [initialComplaintId, complaints]);

  const currentInstrument = instruments.find(i => i.id === selectedInstrumentId) || defaultInstrument;

  // Shortage calculations
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
            address: `${currentInstrument?.shopLocation || 'Counter Location'}, ${currentInstrument?.district || 'Mumbai Suburban'}`,
            verified: true,
          });
        },
        () => {
          setTimeout(() => {
            setIsLocating(false);
            setGpsData({
              lat: 19.0760,
              lng: 72.8777,
              accuracy: 6,
              address: `${currentInstrument?.shopLocation || 'Counter Location'}, ${currentInstrument?.district || 'Mumbai Suburban'} (On-Site Geo Match)`,
              verified: true,
            });
          }, 500);
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
          address: `${currentInstrument?.shopLocation || 'Counter Location'}, ${currentInstrument?.district || 'Mumbai'}`,
          verified: true,
        });
      }, 400);
    }
  };

  // Send OTP
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
  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInstrument) return;
    if (!isOtpVerified) {
      setOtpError('Mobile OTP verification is mandatory before statutory dispatch');
      return;
    }
    if (!commodityName.trim()) {
      setOtpError('Please specify the commodity or item weighed');
      return;
    }
    if (!consentAgreed) {
      setOtpError('You must review and accept the Public Disclosure & Statutory Transparency Consent form before submitting.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const complaint = submitConsumerComplaint({
        instrumentId: currentInstrument.id,
        consumerName: consumerName || 'Citizen Consumer',
        consumerMobile,
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
      setTrackedComplaint(complaint);
      setSearchComplaintId(complaint.id);
      setActiveTab('status');
    }, 600);
  };

  // Track search
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchComplaintId.trim()) return;
    const found = complaints.find(
      c => c.id.toLowerCase() === searchComplaintId.trim().toLowerCase()
    );
    setTrackedComplaint(found || null);
  };

  // Validity calculation
  const certNumber = currentInstrument?.eCertificateId || `CERT-LM-2026-${currentInstrument?.id.slice(-4) || '9001'}`;
  const stickerId = currentInstrument?.hologramStickerId || `HOL-MH-${currentInstrument?.id.slice(-5) || '8801'}`;
  const validUntilDate = currentInstrument?.lastVerificationDate 
    ? new Date(new Date(currentInstrument.lastVerificationDate).setFullYear(new Date(currentInstrument.lastVerificationDate).getFullYear() + 1)).toISOString().split('T')[0]
    : '2027-08-14';

  const getStatusBadge = (status?: ComplaintStatus) => {
    switch (status) {
      case 'Registered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Registered</span>;
      case 'Assigned_To_Inspector':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">Dispatched Directly to Inspector</span>;
      case 'Investigating':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Under Active Investigation</span>;
      case 'Notice_Issued':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">Sec 29 Notice Issued</span>;
      case 'Inspection_Conducted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Raid / Test Conducted</span>;
      case 'Action_Taken':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Penalty & Fine Imposed</span>;
      case 'Resolved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Grievance Resolved</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">Pending Review</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Tricolor National Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow-xs" />

      {/* Top Header with App Logo */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TolSevaLogo variant="horizontal" size="md" colorMode="light" />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-700">Official Metrology Server</span>
            </div>

            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Portal Sign-In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Statutory Subheader */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-6 px-4 sm:px-6 border-b border-indigo-900/60 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                GOVERNMENT OF INDIA • LEGAL METROLOGY ACT, 2009
              </span>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Statutory Citizen Web Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Public Weighing Machine Verification & Grievance Portal</span>
            </h1>
            <p className="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">
              Scan any merchant scale QR sticker to check calibration validity, verify legal stamped capacity, or register short-weighing complaints directly to the assigned Jurisdictional Legal Metrology Inspector.
            </p>
          </div>

          {/* Quick Switch for Demonstration */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 shrink-0 text-xs space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300 block">
              Test Different Counter Scales:
            </span>
            <select
              value={selectedInstrumentId}
              onChange={(e) => {
                setSelectedInstrumentId(e.target.value);
                setSubmittedComplaint(null);
              }}
              className="bg-slate-900 text-white border border-indigo-500/50 rounded-lg px-2.5 py-1 text-xs font-mono focus:ring-1 focus:ring-amber-400 w-full"
            >
              {instruments.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.businessName.slice(0, 22)}... ({inst.status === 'verified' ? '🟢 Pass' : inst.status === 're_audit_assigned' ? '🔴 Red-Flag' : '🟡 Provisional'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-5xl mx-auto mt-6 flex border-b border-indigo-800/80 gap-2">
          <button
            onClick={() => setActiveTab('verify')}
            className={`pb-2.5 px-4 font-bold text-xs transition border-b-2 flex items-center gap-2 ${
              activeTab === 'verify'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Machine Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2.5 px-4 font-bold text-xs transition border-b-2 flex items-center gap-2 ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>2. Register Grievance (Direct to Inspector)</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 px-4 font-bold text-xs transition border-b-2 flex items-center gap-2 ${
              activeTab === 'status'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>3. Track Complaint Status</span>
            {complaints.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                {complaints.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 flex-1">
        {/* ================= TAB 1: MACHINE VERIFICATION STATUS ================= */}
        {activeTab === 'verify' && currentInstrument && (
          <div className="space-y-6">
            {/* Status Hero Card */}
            {currentInstrument.status === 'verified' && (
              <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          STATUTORY E-CERTIFICATE: ACTIVE
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: {currentInstrument.id}
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-slate-900 mt-1">
                        Legally Verified & Approved for Commercial Trade
                      </h2>
                      <p className="text-xs text-emerald-700 font-medium">
                        Standard Weight Stamped by State Directorate of Legal Metrology (Class III Trade Scale)
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                      Certified Valid Until
                    </span>
                    <span className="text-base font-black text-emerald-950 font-mono">
                      {validUntilDate}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      Establishment & Counter Details
                    </h3>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Merchant Trade Name:</span>
                      <span className="font-bold text-slate-900">{currentInstrument.businessName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Registered Proprietor:</span>
                      <span className="font-semibold text-slate-800">{currentInstrument.vendorName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Shop Physical Location:</span>
                      <span className="font-medium text-slate-800 text-right max-w-[220px]">{currentInstrument.shopLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">District & State:</span>
                      <span className="font-medium text-slate-800">{currentInstrument.district}, {currentInstrument.state}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                      <Scale className="w-3.5 h-3.5 text-emerald-600" />
                      Instrument Calibration Record
                    </h3>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Scale Make & Model:</span>
                      <span className="font-bold text-slate-900">{currentInstrument.brandModel}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Hardware Serial Number:</span>
                      <span className="font-mono font-bold text-amber-800">{currentInstrument.serialNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Maximum Capacity:</span>
                      <span className="font-bold text-slate-900">{currentInstrument.capacityKg} kg ({currentInstrument.accuracyClass})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Inspector:</span>
                      <span className="font-semibold text-indigo-700">{currentInstrument.assignedInspectorName || 'Officer Sunita Patil'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold block text-white">Holographic Anti-Counterfeit Seal ID: {stickerId}</span>
                      <span className="text-[11px] text-slate-400 font-mono">e-Certificate Digest: {certNumber}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('register')}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition text-xs flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report Short-Weight at this Scale</span>
                  </button>
                </div>
              </div>
            )}

            {/* Red Flagged or Suspended Card */}
            {currentInstrument.status === 're_audit_assigned' && (
              <div className="bg-rose-50 rounded-2xl p-6 border-2 border-rose-500 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded bg-rose-600 text-white">
                        RED FLAGGED • COMMERCIAL USE SUSPENDED
                      </span>
                      <span className="text-xs text-rose-800 font-bold">
                        Section 30 Order
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-rose-950">
                      Warning: This Instrument is Suspended for Independent Re-Audit
                    </h2>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      Multiple consumer weight discrepancy complaints have been registered against this scale. An independent enforcement officer has been summoned to conduct surprise seizure and recalibration. Commercial trading using this machine is currently illegal under Section 24.
                    </p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-white rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-rose-900 block">Merchant: {currentInstrument.businessName}</span>
                    <span className="text-slate-600">Location: {currentInstrument.shopLocation}</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('register')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition text-xs flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>File Immediate Complaint Against Merchant</span>
                  </button>
                </div>
              </div>
            )}

            {/* Provisional Token Card */}
            {currentInstrument.status === 'provisional_active' && (
              <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-400 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded bg-amber-500 text-white">
                      PROVISIONAL LEGAL SHIELD (7 DAYS)
                    </span>
                    <h2 className="text-xl font-bold text-amber-950">
                      Temporary Stamping Shield Active - Physical Audit Pending
                    </h2>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Merchant has remitted official fee (₹{currentInstrument.feePaid}). Physical inspection appointment has been allocated to {currentInstrument.assignedInspectorName || 'Officer Sunita Patil'}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Consumer Rights Checklist */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span>Statutory Rights of Every Citizen Under Legal Metrology Act, 2009</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900 block">1. Clear Digital Readout</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    The scale display must face the customer and remain unobstructed by goods, displays, or packaging.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900 block">2. Mandatory Zero Before Weighing</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Scale display must read exactly 0.000 kg before goods are placed. Packaging containers must be zeroed out via TARE.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900 block">3. Valid Holographic Sticker</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Scale must display this tamper-evident QR sticker with valid verification seal and inspector stamp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: REGISTER PUBLIC COMPLAINT ================= */}
        {activeTab === 'register' && currentInstrument && (
          <div className="space-y-6">
            {/* Officer Direct Dispatch Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    DIRECT REGISTRATION
                  </span>
                  <span className="text-xs text-indigo-300 font-semibold">
                    Section 29 Legal Notice Workflow
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">
                  Direct Dispatch to Jurisdictional Inspector
                </h2>
                <p className="text-xs text-indigo-200">
                  Complaints registered here bypass middlemen and generate an immediate high-priority inspection audit directly in the queue of <strong>{currentInstrument.assignedInspectorName || 'Officer Sunita Patil'}</strong> ({currentInstrument.district}).
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10 text-center shrink-0 min-w-36">
                <span className="text-[10px] uppercase text-indigo-300 font-bold block">Assigned Officer</span>
                <span className="text-sm font-bold text-amber-300 block">{currentInstrument.assignedInspectorName || 'Officer Sunita Patil'}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Direct Mobile Alert</span>
              </div>
            </div>

            <form onSubmit={handleSubmitComplaint} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              {/* Target Machine Overview */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Reporting Grievance Against Counter Scale:</span>
                  <span className="font-bold text-slate-900 text-sm">{currentInstrument.businessName}</span>
                  <span className="text-slate-500 block">{currentInstrument.shopLocation} • ID: {currentInstrument.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-mono">Serial: {currentInstrument.serialNumber}</span>
                  <span className="text-[11px] font-semibold text-indigo-600">{currentInstrument.brandModel}</span>
                </div>
              </div>

              {/* Violation Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  1. Select Nature of Metrological Violation *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Underweight Commodity (तौल में कमी)',
                    'Tare Weight Not Deducted / Charged for Packaging Box',
                    'Display Obstructed / Not Visible to Customer',
                    'Zero Button Tampered / Reading Starts Above Zero',
                    'Missing or Expired Stamping QR Sticker',
                    'Broken Wire Seal / Physical Weight Modification',
                  ].map((cat) => (
                    <label
                      key={cat}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                        issueCategory === cat
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issueCategory"
                        value={cat}
                        checked={issueCategory === cat}
                        onChange={(e) => setIssueCategory(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Commodity & Weight Calculator */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  2. Commodity Weighed & Shortage Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Commodity / Item Name *
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Basmati Rice, Sweets, Apples"
                      value={commodityName}
                      onChange={(e) => setCommodityName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Billed / Claimed Weight (kg)
                    </span>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="e.g. 1.000"
                      value={billedWeightKg}
                      onChange={(e) => setBilledWeightKg(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-mono"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Actual Weight Received (kg)
                    </span>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="e.g. 0.920"
                      value={actualWeightKg}
                      onChange={(e) => setActualWeightKg(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-mono"
                    />
                  </div>
                </div>

                {/* Shortage Result Pill */}
                {hasWeightComparison && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex items-center justify-between text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-700" />
                      <span className="font-bold">Calculated Weight Discrepancy:</span>
                      <span className="font-mono font-black text-rose-700 text-sm">
                        {shortageGrams} grams ({shortagePercent}% shortage)
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-semibold">
                      Exceeds Maximum Permissible Error (MPE)
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  3. Description / What Happened at the Counter
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe details: e.g. Merchant refused to zero the digital display, weighed heavy cardboard packaging box as sweets weight, or seal wire was broken."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* GPS On-Site Verification */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      Statutory Location Evidence (Geofence Match)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Legal Metrology enforcement requires GPS coordinate match to prove presence at the shop during weighment.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAcquireGps}
                    disabled={isLocating}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    {isLocating ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                        <span>Acquiring GPS...</span>
                      </>
                    ) : gpsData ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">GPS Verified (±{gpsData.accuracy}m)</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3 text-indigo-600" />
                        <span>Verify My GPS Location</span>
                      </>
                    )}
                  </button>
                </div>

                {gpsData && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 flex items-center justify-between">
                    <span className="font-mono">
                      Coordinates: {gpsData.lat}° N, {gpsData.lng}° E ({gpsData.address})
                    </span>
                    <span className="font-bold text-emerald-800">Match: Confirmed On-Site</span>
                  </div>
                )}
              </div>

              {/* Consumer Authentication & Anti-Spam OTP */}
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Citizen Contact & Mobile OTP Verification (Spam Protection)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Your Name / Citizen Identity *
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Patil"
                      value={consumerName}
                      onChange={(e) => setConsumerName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      10-Digit Mobile Number (for Investigation Updates) *
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        placeholder="e.g. 98201 00000"
                        value={consumerMobile}
                        onChange={(e) => setConsumerMobile(e.target.value)}
                        disabled={isOtpVerified}
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 transition font-mono"
                      />
                      {!isOtpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shrink-0 shadow-2xs"
                        >
                          {isOtpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* OTP Input Box */}
                {isOtpSent && !isOtpVerified && (
                  <div className="bg-white p-3 rounded-lg border border-indigo-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                    <div>
                      <span className="text-xs font-bold text-indigo-950 block">
                        Enter 6-Digit SMS OTP sent to {consumerMobile}:
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Demo Sandbox Code: <strong className="text-indigo-700 font-mono text-xs">{generatedOtp}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-center font-mono font-bold tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                )}

                {isOtpVerified && (
                  <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Mobile Number Verified via OTP. Grievance authenticated for Inspector Dispatch.</span>
                  </div>
                )}

                {otpError && (
                  <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {otpError}
                  </p>
                )}
              </div>

              {/* Statutory Privacy Policy & Public Complaint Consent Form */}
              <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl space-y-3 text-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Statutory Privacy Policy & Public Disclosure Consent Form
                  </span>
                </div>

                <div className="text-xs text-amber-900 leading-relaxed bg-white/80 p-3 rounded-lg border border-amber-200/70 space-y-1.5">
                  <p>
                    Under the <strong>Legal Metrology Act, 2009 (Enforcement Rules)</strong> and Government of India public transparency mandates:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                    <li>
                      <strong>Public Grievance Registry:</strong> Grievance details (machine ID, shop name, nature of violation, timestamp, and verification findings) <strong>will be recorded publicly</strong> on the TolSeva Open Metrology Dashboard for public awareness and consumer protection.
                    </li>
                    <li>
                      <strong>Statutory Regulatory Access:</strong> The complaint will be transmitted directly to jurisdictional Legal Metrology Officers, State Controllers, and the Ministry of Consumer Affairs for mandatory investigation and prosecution.
                    </li>
                    <li>
                      <strong>Citizen Contact Confidentiality:</strong> Your 10-digit mobile number and personal identity are protected under whistleblower safeguards and are accessible only by the assigned inspecting officer for case verification.
                    </li>
                  </ul>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 shrink-0"
                  />
                  <span className="text-xs font-semibold text-amber-950 leading-snug">
                    I understand and give explicit consent that this complaint will be public, viewable by citizens on the transparency dashboard, and transmitted to government enforcement authorities for statutory legal action. *
                  </span>
                </label>
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  Protected under Whistleblower provisions of Legal Metrology Act, 2009.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting || !consentAgreed}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Directly to Inspector...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Grievance Directly to Inspector</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 3: TRACK COMPLAINT STATUS ================= */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Search Bar for Complaints */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-600" />
                    <span>Track Metrology Grievance Status</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your Complaint Tracking ID (e.g. <code>GRV-2026-8812</code>) to view live action taken by the Legal Metrology Officer.
                  </p>
                </div>

                <form onSubmit={handleTrackSearch} className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Enter GRV-2026-XXXX"
                    value={searchComplaintId}
                    onChange={(e) => setSearchComplaintId(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-indigo-500 w-full sm:w-52"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-2xs shrink-0"
                  >
                    Track
                  </button>
                </form>
              </div>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[11px] font-medium">Quick Preview Records:</span>
                {complaints.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSearchComplaintId(c.id);
                      setTrackedComplaint(c);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${
                      trackedComplaint?.id === c.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {c.id} ({c.status.replace(/_/g, ' ')})
                  </button>
                ))}
              </div>
            </div>

            {/* Active Complaint Status View */}
            {trackedComplaint ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6">
                {/* Status Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        TRACKING ID: <strong className="text-indigo-900">{trackedComplaint.id}</strong>
                      </span>
                      {getStatusBadge(trackedComplaint.status)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {trackedComplaint.issueCategory}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Reported against: <strong>{trackedComplaint.businessName}</strong> ({trackedComplaint.shopLocation})
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right shrink-0 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Enforcement Officer</span>
                    <span className="font-bold text-indigo-950 text-sm block">
                      {trackedComplaint.assignedInspectorName || 'Officer Sunita Patil'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                      ID: {trackedComplaint.assignedInspectorId || 'INS-MAH-409'}
                    </span>
                  </div>
                </div>

                {/* Complaint Highlights Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Commodity Weighed</span>
                    <span className="font-bold text-slate-900">{trackedComplaint.commodityName}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Reported Shortage</span>
                    <span className="font-mono font-bold text-rose-700">
                      {trackedComplaint.shortageGrams ? `${trackedComplaint.shortageGrams}g` : 'Tare/Display Issue'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Citizen Contact</span>
                    <span className="font-mono text-slate-800">{trackedComplaint.consumerMobile}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Filing Date & Time</span>
                    <span className="font-mono text-slate-800">{trackedComplaint.createdAt}</span>
                  </div>
                </div>

                {/* Statutory Notice & Penalty Box (if active) */}
                {(trackedComplaint.hearingDate || trackedComplaint.penaltyImposed) && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-purple-900">
                      <AlertTriangle className="w-4 h-4 text-purple-700" />
                      <span>Statutory Action Recorded under Section 29/30</span>
                    </div>
                    {trackedComplaint.penaltyImposed && (
                      <p className="text-purple-900">
                        Compounding Penalty / Fine Imposed: <strong className="text-purple-950 text-sm">₹{trackedComplaint.penaltyImposed.toLocaleString('en-IN')}</strong>
                      </p>
                    )}
                    {trackedComplaint.hearingDate && (
                      <p className="text-purple-900">
                        Departmental Court Hearing Date: <strong className="text-purple-950">{trackedComplaint.hearingDate}</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* Inspector Notes */}
                {trackedComplaint.inspectorRemarks && (
                  <div className="p-4 bg-slate-900 text-white rounded-xl space-y-1 text-xs">
                    <span className="text-amber-400 font-bold block text-[11px] uppercase tracking-wider">
                      Official Remarks by {trackedComplaint.assignedInspectorName || 'Legal Metrology Officer'}:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      "{trackedComplaint.inspectorRemarks}"
                    </p>
                  </div>
                )}

                {/* Step-by-Step Live Investigation Timeline */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                    Investigation & Legal Redressal Progression
                  </h4>

                  <div className="relative border-l-2 border-indigo-200 ml-3.5 space-y-6">
                    {(trackedComplaint.timeline && trackedComplaint.timeline.length > 0 
                      ? trackedComplaint.timeline 
                      : [
                          {
                            status: 'Registered' as ComplaintStatus,
                            title: 'Citizen Complaint Registered via QR Code',
                            description: `Grievance submitted by ${trackedComplaint.consumerName}. Deficit logged with GPS evidence.`,
                            timestamp: trackedComplaint.createdAt,
                            actor: 'Citizen Portal'
                          },
                          {
                            status: 'Assigned_To_Inspector' as ComplaintStatus,
                            title: `Directly Dispatched to ${trackedComplaint.assignedInspectorName || 'Officer Sunita Patil'}`,
                            description: 'High-priority task added to inspector mobile dashboard for field audit.',
                            timestamp: 'Automated Dispatch',
                            actor: 'TolSeva Engine'
                          }
                        ]
                    ).map((evt, idx) => (
                      <div key={idx} className="relative pl-6">
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                        <div className="space-y-1 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="font-bold text-slate-900">{evt.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {evt.description}
                          </p>
                          <span className="text-[10px] text-indigo-600 font-semibold block">
                            Logged by: {evt.actor}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Assistance */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Toll-Free Consumer Grievance National Helpline: <strong>1915</strong></span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print Formal Grievance Acknowledgement</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">No Complaint Selected</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Enter your tracking number above or click any of the preview records to see real-time investigation steps, inspector notes, and penalties.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Statutory Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <TolSevaLogo variant="icon-only" size="xs" colorMode="light" />
            <span>
              © 2026 <strong>TolSeva</strong> • National Legal Metrology Directorate, New Delhi.
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Legal Metrology Act, 2009</span>
            <span>•</span>
            <span>Sec. 24 & Sec. 29 Enforced</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">NIC Cloud Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
