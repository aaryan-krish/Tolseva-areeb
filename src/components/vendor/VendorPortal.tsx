import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Plus, 
  Mic, 
  Download, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  QrCode,
  Building2,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Globe,
  Languages,
  Search,
  Filter,
  Volume2,
  Printer
} from 'lucide-react';
import { useTolSeva } from '../../context/TolSevaContext';
import { Instrument } from '../../types';
import { InstrumentRegistrationModal } from './InstrumentRegistrationModal';
import { ProvisionalTokenModal } from './ProvisionalTokenModal';
import { HologramStickerModal } from './HologramStickerModal';
import { PublicVerificationModal } from '../common/PublicVerificationModal';
import { VoiceWizard } from './VoiceWizard';
import { VendorDisputes } from './VendorDisputes';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { VENDOR_LANGUAGES } from '../../utils/translations';

export const VendorPortal: React.FC = () => {
  const { instruments, currentUser, vendorLanguage, setVendorLanguage, t } = useTolSeva();

  const [activeTab, setActiveTab] = useState<'instruments' | 'disputes' | 'rules'>('instruments');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVoiceWizardOpen, setIsVoiceWizardOpen] = useState(false);
  const [selectedTokenInstrument, setSelectedTokenInstrument] = useState<Instrument | null>(null);
  const [selectedStickerInstrument, setSelectedStickerInstrument] = useState<Instrument | null>(null);
  const [selectedPublicInstrument, setSelectedPublicInstrument] = useState<Instrument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'provisional_active' | 'verified' | 're_audit_assigned'>('all');

  // Metrics
  const totalInstruments = instruments.length;
  const provisionalActive = instruments.filter(i => i.status === 'provisional_active').length;
  const verifiedCount = instruments.filter(i => i.status === 'verified').length;
  const flagRedCount = instruments.filter(i => i.flagStatus === 'red').length;

  const filteredInstruments = instruments.filter(inst => {
    const matchesFilter = statusFilter === 'all' || inst.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      inst.brandModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentLangObj = VENDOR_LANGUAGES.find(l => l.code === vendorLanguage) || VENDOR_LANGUAGES[0];

  return (
    <div className="space-y-6">
      {/* Quick Language Preference Banner for Local Merchants */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <LanguageSwitcher variant="pills" showVoiceNote={true} />
      </div>

      {/* Top Welcome & Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 px-2.5 py-0.5 rounded border border-indigo-700/50">
                {t.authorizedTraderBadge}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {t.gstinLabel}: <span className="font-mono text-white font-semibold">{currentUser?.identifier}</span>
              </span>
              <span className="text-xs bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-700/60 font-medium flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {currentUser?.businessName || 'Sharma Provisions & Daily Mart'}
            </h2>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              {t.portalSubtitle}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="vendor-voice-wizard-top-btn"
              onClick={() => setIsVoiceWizardOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 group"
            >
              <Mic className="w-4 h-4 text-slate-950 animate-bounce" />
              <span>{t.voiceAiBtn}</span>
            </button>

            <button
              id="vendor-manual-register-btn"
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>{t.manualFormBtn}</span>
            </button>
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Scale className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t.totalScales}</span>
            <Scale className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalInstruments}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">{t.totalScalesSub}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-medium">{t.provisionalActive}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{provisionalActive}</p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">{t.provisionalActiveSub}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-medium">{t.verifiedCerts}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{verifiedCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">{t.verifiedCertsSub}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t.vigilanceAlerts}</span>
            <AlertTriangle className={`w-4 h-4 ${flagRedCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <p className={`text-2xl font-bold ${flagRedCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {flagRedCount}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">{t.vigilanceAlertsSub}</span>
        </div>
      </div>

      {/* Mandatory QR Affixation Banner for Verified Scales */}
      {verifiedCount > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-300 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                  Mandatory Holographic QR Affixation (Legal Metrology Act, Sec. 24)
                </h4>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase">
                  Action Required
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5 max-w-2xl leading-relaxed">
                You have {verifiedCount} verified scale(s). It is mandatory for the trader to print and affix the tamper-evident holographic QR sticker on the scale body facing the customer. Consumers can scan this to verify calibration and report short-weight disputes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                const verifiedInst = instruments.find(i => i.status === 'verified');
                if (verifiedInst) setSelectedStickerInstrument(verifiedInst);
              }}
              className="flex-1 md:flex-initial px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Scale Sticker</span>
            </button>

            <button
              onClick={() => {
                const verifiedInst = instruments.find(i => i.status === 'verified');
                if (verifiedInst) setSelectedPublicInstrument(verifiedInst);
              }}
              className="flex-1 md:flex-initial px-3.5 py-2 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              <span>Public QR Web Popup</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('instruments')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'instruments'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{t.myScalesTab} ({instruments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'disputes'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{t.disputesTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.rulesTab}</span>
        </button>
      </div>

      {/* Tab: Instruments Listing */}
      {activeTab === 'instruments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {t.inventoryHeader}
              </h3>
              <span className="text-xs text-slate-500">
                {t.inventorySub}
              </span>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchScalesPlaceholder}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="all">{t.filterAll}</option>
                <option value="provisional_active">{t.filterProvisional}</option>
                <option value="verified">{t.filterVerified}</option>
                <option value="re_audit_assigned">{t.reAuditBadge}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstruments.map((inst) => (
              <div
                key={inst.id}
                className="bg-white border border-slate-200 hover:border-indigo-200 rounded-xl p-5 transition shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {inst.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        inst.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inst.status === 'provisional_active'
                          ? 'bg-amber-100 text-amber-800'
                          : inst.status === 're_audit_assigned'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {inst.status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                      {inst.status === 'provisional_active' && <Clock className="w-3 h-3" />}
                      {inst.status === 're_audit_assigned' && <AlertTriangle className="w-3 h-3" />}
                      <span>
                        {inst.status === 'provisional_active' ? t.tokenActiveBadge : inst.status === 'verified' ? t.verifiedBadge : inst.status.replace('_', ' ')}
                      </span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{inst.brandModel}</h4>
                    <p className="text-xs text-slate-500">{inst.category}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t.capacityLabel}</span>
                      <span className="font-bold text-slate-800">
                        {inst.maxCapacityValue ? `${inst.maxCapacityValue} ${inst.maxCapacityUnit}` : `${inst.capacityKg} kg`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t.accuracyClassLabel}</span>
                      <span className="font-bold text-indigo-700">{inst.accuracyClass}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t.serialNumberLabel}</span>
                      <span className="font-mono text-slate-700 truncate block">{inst.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t.feePaidLabel}</span>
                      <span className="font-semibold text-emerald-700">₹{inst.feePaid}</span>
                    </div>
                    {inst.verificationIntervalValue && (
                      <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-600">
                        <span>Interval (e): <strong className="text-slate-800 font-mono">{inst.verificationIntervalValue} {inst.verificationIntervalUnit || 'g'}</strong></span>
                        {inst.modelApprovalNumber && (
                          <span>Approval: <strong className="text-slate-800 font-mono">{inst.modelApprovalNumber}</strong></span>
                        )}
                      </div>
                    )}
                  </div>

                  {inst.status === 'provisional_active' && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {t.legalShieldValidLabel}
                      </span>
                      <span className="font-bold font-mono">{inst.provisionalTokenExpiry}</span>
                    </div>
                  )}

                  {inst.status === 'verified' && (
                    <div className="bg-emerald-50/90 border border-emerald-300 rounded-xl p-3 text-[11px] text-emerald-950 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <QrCode className="w-4 h-4 text-emerald-700" />
                          Holographic QR Issued (Mandatory)
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                          {inst.hologramStickerId || 'HOL-MH-90412'}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800 leading-tight">
                        Sec. 24 Compliance: Weatherproof QR sticker must be affixed to scale body facing customers.
                      </p>
                      <div className="flex gap-1.5 pt-0.5">
                        <button
                          onClick={() => setSelectedStickerInstrument(inst)}
                          className="flex-1 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition shadow-xs"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Affix QR Sticker</span>
                        </button>
                        <button
                          onClick={() => setSelectedPublicInstrument(inst)}
                          className="py-1.5 px-2.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg font-bold text-[10px] flex items-center gap-1 transition"
                          title="Simulate Public Web View as Seen by Consumers"
                        >
                          <ExternalLink className="w-3 h-3 text-emerald-700" />
                          <span>Public Popup</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {inst.status === 're_audit_assigned' && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-[11px] text-rose-900">
                      <span className="font-bold block flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        {t.reAuditReasonLabel}
                      </span>
                      <p className="text-[10px] text-rose-700 mt-0.5">{inst.reAuditReason}</p>
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTokenInstrument(inst)}
                    className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.viewFormVBtn}</span>
                  </button>

                  <button
                    onClick={() => setSelectedPublicInstrument(inst)}
                    className="p-2 bg-slate-100 hover:bg-indigo-50 text-indigo-700 rounded-lg transition"
                    title="Simulate Consumer QR Verification Scan"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedTokenInstrument(inst)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    title={t.downloadPdfBtn}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Disputes & Grievance */}
      {activeTab === 'disputes' && <VendorDisputes />}

      {/* Tab: Statutory Rules & Tolerances */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.rulesTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t.rulesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">{t.rule14ImmunityTitle}</h4>
              <p className="text-slate-600 leading-relaxed">
                {t.rule14ImmunityText}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Maximum Permissible Error (MPE) Limits</h4>
              <p className="text-slate-600 leading-relaxed">
                For Class III commercial retail scales (up to 30kg):
                <br />• 0 to 500e: ±1 division (e.g. ±5g for a 5g interval)
                <br />• 501 to 2000e: ±2 divisions (e.g. ±10g)
                <br />Deviations outside this statutory band require recalibration by authorized repairers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Accessibility Voice Assistant Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-voice-assistant-trigger"
          onClick={() => setIsVoiceWizardOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-4 py-3.5 rounded-full shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all border-2 border-white/80 cursor-pointer"
          title={t.floatingVoiceBtn}
        >
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
          </span>
          <Mic className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
          <span className="text-xs sm:text-sm font-extrabold tracking-tight">
            {t.floatingVoiceBtn}
          </span>
        </button>
      </div>

      {/* Modals */}
      <InstrumentRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <VoiceWizard
        isOpen={isVoiceWizardOpen}
        onClose={() => setIsVoiceWizardOpen(false)}
        onFillFormData={() => {
          setIsVoiceWizardOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onRegisteredSuccess={(inst) => {
          setIsVoiceWizardOpen(false);
          setSelectedTokenInstrument(inst);
        }}
      />

      {selectedTokenInstrument && (
        <ProvisionalTokenModal
          instrument={selectedTokenInstrument}
          isOpen={!!selectedTokenInstrument}
          onClose={() => setSelectedTokenInstrument(null)}
        />
      )}

      {selectedStickerInstrument && (
        <HologramStickerModal
          instrument={selectedStickerInstrument}
          isOpen={!!selectedStickerInstrument}
          onClose={() => setSelectedStickerInstrument(null)}
          onOpenPublicVerification={(inst) => {
            setSelectedStickerInstrument(null);
            setSelectedPublicInstrument(inst);
          }}
        />
      )}

      {selectedPublicInstrument && (
        <PublicVerificationModal
          isOpen={!!selectedPublicInstrument}
          initialInstrumentId={selectedPublicInstrument.id}
          onClose={() => setSelectedPublicInstrument(null)}
        />
      )}
    </div>
  );
};
