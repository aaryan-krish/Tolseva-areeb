import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Printer, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  Sparkles,
  Info,
  Check,
  Copy
} from 'lucide-react';
import { Instrument } from '../../types';
import { TolSevaLogo } from '../common/TolSevaLogo';

interface HologramStickerModalProps {
  instrument: Instrument;
  isOpen: boolean;
  onClose: () => void;
  onOpenPublicVerification: (instrument: Instrument) => void;
}

export const HologramStickerModal: React.FC<HologramStickerModalProps> = ({
  instrument,
  isOpen,
  onClose,
  onOpenPublicVerification,
}) => {
  const [isAffixedAcknowledged, setIsAffixedAcknowledged] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const certNumber = instrument.eCertificateId || `CERT-LM-2026-${instrument.id.slice(-4)}`;
  const stickerId = instrument.hologramStickerId || `HOL-MH-${instrument.id.slice(-5)}`;
  const validUntilDate = instrument.lastVerificationDate 
    ? new Date(new Date(instrument.lastVerificationDate).setFullYear(new Date(instrument.lastVerificationDate).getFullYear() + 1)).toISOString().split('T')[0]
    : '2027-08-14';

  const publicPortalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?mode=public_verify&scaleId=${encodeURIComponent(instrument.id)}`
    : `https://tolseva.gov.in/verify?scaleId=${instrument.id}`;

  useEffect(() => {
    if (instrument?.id) {
      QRCode.toDataURL(publicPortalUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 240,
        color: {
          dark: '#090d16',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR Code:', err));
    }
  }, [instrument?.id, publicPortalUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(publicPortalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-6 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-white">
                  Mandatory Holographic Verification QR Sticker
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Form V Seal
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Statutory Physical Marking under Section 24, Legal Metrology Act 2009
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

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[78vh]">
          {/* Statutory Mandate Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-amber-950">
                Mandatory Physical Sticker Affixation Requirement:
              </span>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Upon successful accuracy testing, the trader <strong>must print and permanently affix this holographic QR sticker</strong> on the scale body directly facing the customer. Failure to display the QR sticker during commercial trade attracts penalties up to ₹25,000 under Section 30.
              </p>
            </div>
          </div>

          {/* Holographic Sticker Card Simulation */}
          <div className="relative rounded-2xl p-1 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 shadow-xl overflow-hidden group">
            {/* Iridescent shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-yellow-200/25 to-purple-500/20 pointer-events-none" />

            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[14px] p-5 relative overflow-hidden">
              {/* Watermark Emblem */}
              <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none">
                <ShieldCheck className="w-48 h-48" />
              </div>

              {/* Sticker Top Header */}
              <div className="flex items-center justify-between border-b border-indigo-700/60 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/20">
                    <TolSevaLogo variant="icon-only" size="sm" colorMode="dark" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                      GOVERNMENT OF INDIA • LEGAL METROLOGY
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                      <span>TOLSEVA VERIFIED E-STAMP & TAMPER-EVIDENT QR</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30 font-bold">
                    {instrument.accuracyClass.toUpperCase()} PASS
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    ID: {instrument.id}
                  </span>
                </div>
              </div>

              {/* Sticker Center Details & Real QR Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* QR Code Container */}
                <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-slate-900 shadow-lg border border-indigo-200">
                  <div className="relative w-28 h-28 flex items-center justify-center bg-white rounded-lg p-1">
                    {qrDataUrl ? (
                      <img 
                        src={qrDataUrl} 
                        alt="Public Verification QR Code" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-slate-900 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-slate-900 tracking-wider uppercase mt-1">
                    SCAN TO VERIFY & COMPLAIN
                  </span>
                  <span className="text-[8px] font-mono text-indigo-700 font-bold text-center truncate max-w-[150px]">
                    tolseva.gov.in/verify?scaleId={instrument.id}
                  </span>
                </div>

                {/* Statutory Scale & Merchant Info */}
                <div className="sm:col-span-2 space-y-2 text-xs">
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Merchant / Counter:</span>
                      <span className="font-bold text-white truncate max-w-[180px]">{instrument.businessName}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Scale Make & Model:</span>
                      <span className="font-semibold text-indigo-200 truncate max-w-[180px]">{instrument.brandModel}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Serial No:</span>
                      <span className="font-mono text-amber-300 font-bold">{instrument.serialNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Capacity & Class:</span>
                      <span className="font-semibold text-white">{instrument.capacityKg} kg • {instrument.accuracyClass}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-indigo-900/40 border border-indigo-700/50 p-2 rounded-lg">
                      <span className="text-indigo-300 block">Hologram Serial No</span>
                      <span className="font-mono font-bold text-amber-300 text-[11px]">{stickerId}</span>
                    </div>
                    <div className="bg-emerald-900/40 border border-emerald-700/50 p-2 rounded-lg">
                      <span className="text-emerald-300 block">Certificate Ref</span>
                      <span className="font-mono font-bold text-emerald-300 text-[11px]">{certNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] bg-slate-900/90 p-2 rounded-lg border border-slate-700">
                    <span className="text-slate-400">Statutory Validity Until:</span>
                    <span className="font-bold text-emerald-400 font-mono">{validUntilDate}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Security Hash */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
                <span className="font-mono truncate max-w-[320px]">
                  SHA256: {instrument.qrSecurityHash || `SHA256-${stickerId}-GOV-APPROVED`}
                </span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Anti-Tamper Cryptographic Seal
                </span>
              </div>
            </div>
          </div>

          {/* Test Scan Callout - Bridge to Public Verification */}
          <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                Live Citizen QR Scan & Grievance Portal
              </h4>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                When a consumer scans this physical QR sticker with their mobile camera, it opens the official <strong>Public Verification & Grievance Portal</strong> for scale <strong>{instrument.id}</strong>.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-500 truncate max-w-sm">
                <span className="truncate">{publicPortalUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-sans font-bold flex items-center gap-1 shrink-0"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPublicVerification(instrument);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Citizen QR Portal</span>
            </button>
          </div>

          {/* Affixation Acknowledgment Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition text-xs">
            <input
              type="checkbox"
              checked={isAffixedAcknowledged}
              onChange={(e) => setIsAffixedAcknowledged(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-slate-700 text-[11px] leading-relaxed">
              <strong>Statutory Declaration:</strong> I confirm that this QR sticker will be visibly printed on weatherproof adhesive label (3" x 2") and affixed adjacent to the primary weight readout of scale <strong>{instrument.serialNumber}</strong>.
            </span>
          </label>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Standard Print Size: 3" x 2" (Standard Metrology Adhesive)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG / PNG</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sticker Label</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
