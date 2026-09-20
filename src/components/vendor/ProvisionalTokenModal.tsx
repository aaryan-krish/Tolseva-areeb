import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  FileText,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { Instrument } from '../../types';
import jsPDF from 'jspdf';

interface ProvisionalTokenModalProps {
  instrument: Instrument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProvisionalTokenModal: React.FC<ProvisionalTokenModalProps> = ({
  instrument,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !instrument) return null;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(30, 41, 59); // Slate 800
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('GOVERNMENT OF INDIA', 105, 12, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('DEPARTMENT OF CONSUMER AFFAIRS - LEGAL METROLOGY DIVISION', 105, 18, { align: 'center' });
      doc.setFontSize(9);
      doc.text('SMART INDIA HACKATHON 2026 - DIGITAL COMPLIANCE PLATFORM (TOLSEVA)', 105, 24, { align: 'center' });

      // Title Box
      doc.setFillColor(238, 242, 255); // Indigo 50
      doc.setDrawColor(99, 102, 241); // Indigo 500
      doc.rect(14, 38, 182, 16, 'FD');

      doc.setTextColor(30, 27, 75);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('FORM V: PROVISIONAL VERIFICATION TOKEN FOR LEGAL TRADE', 105, 45, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('(Issued under Rule 14 of Legal Metrology Enforcement Rules 2011 & Section 24 of LM Act 2009)', 105, 50, { align: 'center' });

      // Token Summary Box
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 58, 182, 26, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('PROVISIONAL TOKEN ID:', 18, 66);
      doc.setFont('helvetica', 'normal');
      doc.text(instrument.id, 65, 66);

      doc.setFont('helvetica', 'bold');
      doc.text('DATE OF REGISTRATION:', 18, 73);
      doc.setFont('helvetica', 'normal');
      doc.text(instrument.registeredDate, 65, 73);

      doc.setFont('helvetica', 'bold');
      doc.text('VALID UNTIL (7 DAYS):', 110, 66);
      doc.setTextColor(180, 83, 9); // Amber
      doc.setFont('helvetica', 'bold');
      doc.text(`${instrument.provisionalTokenExpiry} (23:59 IST)`, 155, 66);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('STATUTORY FEE PAID:', 110, 73);
      doc.setFont('helvetica', 'normal');
      doc.text(`INR ${instrument.feePaid}.00 (TXN: ${instrument.paymentId})`, 155, 73);

      // Section: Merchant & Premises
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('1. MERCHANT & PREMISES DETAILS', 14, 92);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Business Trade Name: ${instrument.businessName}`, 18, 99);
      doc.text(`Proprietor / Representative: ${instrument.vendorName} (${instrument.vendorContact})`, 18, 105);
      doc.text(`Premises Address: ${instrument.shopLocation}`, 18, 111);
      doc.text(`District / State: ${instrument.district}, ${instrument.state} - ${instrument.pincode}`, 18, 117);

      // Section: Instrument Specification
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('2. WEIGHING INSTRUMENT SPECIFICATIONS', 14, 128);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Instrument Category: ${instrument.category}`, 18, 134);
      doc.text(`Make & Model Series: ${instrument.brandModel} ${instrument.modelApprovalNumber ? `(Approval: ${instrument.modelApprovalNumber})` : ''}`, 18, 139);
      doc.text(`Manufacturer Serial No: ${instrument.serialNumber}`, 18, 144);
      const capText = instrument.maxCapacityValue ? `${instrument.maxCapacityValue} ${instrument.maxCapacityUnit}` : `${instrument.capacityKg} kg`;
      const intervalText = instrument.verificationIntervalValue ? ` | Interval (e): ${instrument.verificationIntervalValue} ${instrument.verificationIntervalUnit || 'g'}` : '';
      doc.text(`Rated Capacity: ${capText}${intervalText}`, 18, 149);
      doc.text(`Accuracy Classification: ${instrument.accuracyClass} (OIML R 76 Standard)`, 18, 154);
      if (instrument.stampedIdentifier) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 27, 75);
        doc.text(`Stamped Identifier (Rule 14): ${instrument.stampedIdentifier}`, 18, 159);
        doc.setFont('helvetica', 'normal');
      }

      // Legal Guarantee Clause Box
      doc.setFillColor(254, 243, 199); // Amber 100
      doc.setDrawColor(245, 158, 11);
      doc.rect(14, 168, 182, 34, 'FD');

      doc.setTextColor(146, 64, 14);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('STATUTORY LEGAL PROTECTION NOTICE:', 18, 175);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const noticeText = 
        'This Provisional Certificate is issued pursuant to Rule 14. Possession of this digital token guarantees uninterrupted legal commercial trade for exactly seven (7) calendar days from payment date. No enforcement officer shall impound the instrument or levy Section 30 penalties during this transition window pending physical verification and holographic stamping.';
      const splitNotice = doc.splitTextToSize(noticeText, 174);
      doc.text(splitNotice, 18, 181);

      // Officer & Security Signature Box
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(255, 255, 255);
      doc.rect(14, 210, 182, 45, 'FD');

      doc.setTextColor(71, 85, 105);
      doc.setFontSize(8);
      doc.text('ASSIGNED INSPECTION JURISDICTION:', 18, 218);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(instrument.assignedInspectorName || 'Officer Sunita Patil, Senior LM Officer', 18, 224);

      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.text('DIGITAL VERIFICATION HASH (HMAC-SHA256):', 18, 232);
      doc.setFont('courier', 'bold');
      doc.text(instrument.qrSecurityHash || 'SHA256-TOLSEVA-SECURE-STAMP-7829', 18, 238);

      doc.setFont('helvetica', 'normal');
      doc.text('Generated electronically via TolSeva Digital Legal Metrology Infrastructure (NIC Cloud).', 18, 246);

      // Official Stamp Simulator
      doc.setDrawColor(37, 99, 235);
      doc.circle(165, 230, 14);
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('LEGAL METROLOGY', 165, 228, { align: 'center' });
      doc.text('PROVISIONAL', 165, 231, { align: 'center' });
      doc.text('GOVT OF INDIA', 165, 234, { align: 'center' });

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('TolSeva Portal | Department of Consumer Affairs | SIH 2026 | Verify at https://tolseva.gov.in/verify', 105, 288, { align: 'center' });

      doc.save(`TolSeva_Provisional_Token_${instrument.serialNumber}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Generating PDF... Please check print options if download is blocked.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-8 overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Form V: Provisional Token Generator</h3>
              <p className="text-xs text-slate-400">Section 24, Legal Metrology Act 2009 & Rule 14</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas Preview */}
        <div className="p-6 bg-slate-50 overflow-y-auto max-h-[72vh]">
          <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-8xl font-black rotate-[-30deg] tracking-widest text-slate-900">
                PROVISIONAL
              </span>
            </div>

            {/* Emblem and Govt Heading */}
            <div className="text-center pb-4 border-b border-slate-200 relative">
              <div className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                Uninterrupted Legal Trade Authorized (7 Days)
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">GOVERNMENT OF INDIA</h2>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Department of Consumer Affairs • Legal Metrology Division
              </p>
              <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                FORM V — PROVISIONAL WEIGHT & MEASURE VERIFICATION TOKEN
              </p>
            </div>

            {/* Token Highlight Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Token Identification</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{instrument.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Registration Date</span>
                <span className="font-semibold text-slate-800">{instrument.registeredDate}</span>
              </div>
              <div>
                <span className="text-amber-700 block text-[10px] uppercase font-bold">Valid Until (7 Days)</span>
                <span className="font-bold text-amber-700 text-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {instrument.provisionalTokenExpiry}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Commercial Premises</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{instrument.businessName}</p>
                  <p className="text-slate-600">{instrument.shopLocation}</p>
                  <p className="text-slate-500">{instrument.district}, {instrument.state} - {instrument.pincode}</p>
                  <p className="text-slate-500 mt-1">Trader: {instrument.vendorName} ({instrument.vendorContact})</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Weighing Instrument</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{instrument.brandModel}</p>
                  <p className="text-slate-600">Category: {instrument.category}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-100 font-mono text-slate-800 rounded font-semibold">
                      S/N: {instrument.serialNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                      {instrument.accuracyClass}
                    </span>
                    {instrument.modelApprovalNumber && (
                      <span className="px-2 py-0.5 bg-slate-100 font-mono text-slate-700 rounded text-[10px]">
                        Appr: {instrument.modelApprovalNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 mt-1 flex-wrap">
                    <p>Max: <span className="font-semibold text-slate-800">{instrument.maxCapacityValue ? `${instrument.maxCapacityValue} ${instrument.maxCapacityUnit}` : `${instrument.capacityKg} kg`}</span></p>
                    {instrument.verificationIntervalValue && (
                      <p>Interval (e): <span className="font-semibold text-slate-800">{instrument.verificationIntervalValue} {instrument.verificationIntervalUnit || 'g'}</span></p>
                    )}
                  </div>
                  {instrument.stampedIdentifier && (
                    <p className="text-indigo-900 font-mono font-bold text-[11px] mt-1">
                      Seal Code: {instrument.stampedIdentifier}
                    </p>
                  )}
                </div>
              </div>

              {/* Statutory Fee & Payment */}
              <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-lg text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-semibold block">Statutory Verification Fee Paid</span>
                    <span className="text-[11px] text-emerald-700">Transaction Ref: {instrument.paymentId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-600 block">Total Amount</span>
                  <span className="font-bold text-base">₹{instrument.feePaid}.00</span>
                </div>
              </div>

              {/* Legal Exemption Clause */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Statutory Legal Exemption Notice (Rule 14 Protection):</span>
                </div>
                The holder of this provisional token is authorized by the Department of Consumer Affairs to conduct fair commercial transactions without disruption. Field inspectors are hereby instructed not to seize or impede this device during the 7-day validation window.
              </div>

              {/* Security Footprint & Hologram simulation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="space-y-1 text-[11px]">
                  <span className="text-slate-400 block font-mono">Assigned Inspector:</span>
                  <span className="font-semibold text-slate-800">{instrument.assignedInspectorName || 'Officer Sunita Patil'}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Token Hash: {instrument.qrSecurityHash}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-lg text-white flex flex-col items-center justify-center">
                    <QrCode className="w-10 h-10 text-white" />
                    <span className="text-[8px] tracking-tighter">VERIFIED QR</span>
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-indigo-600 flex flex-col items-center justify-center text-center text-indigo-700 p-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-[7px] font-black uppercase leading-tight mt-0.5">LEGAL SEAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Keep a digital or physical copy at your commercial counter.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Token</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
