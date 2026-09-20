import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  MapPin, 
  Phone, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Filter, 
  QrCode, 
  Eye, 
  X,
  FileText,
  Scale
} from 'lucide-react';
import { ConsumerComplaint, Instrument } from '../../types';
import { useTolSeva } from '../../context/TolSevaContext';
import { PublicVerificationModal } from '../common/PublicVerificationModal';

interface CitizenGrievanceDashboardProps {
  viewRole?: 'inspector' | 'admin';
}

export const CitizenGrievanceDashboard: React.FC<CitizenGrievanceDashboardProps> = ({
  viewRole = 'inspector',
}) => {
  const { complaints, instruments } = useTolSeva();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<ConsumerComplaint | null>(null);
  const [publicInstrumentId, setPublicInstrumentId] = useState<string | null>(null);

  // Metrics
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  // Red-flagged vendors (3+ complaints)
  const redFlaggedVendorsCount = instruments.filter(i => (i.complaintsCount || 0) >= 3 || i.flagStatus === 'red').length;

  // Filter complaints
  const filteredComplaints = complaints.filter(comp => {
    const isPending = comp.status !== 'Resolved';
    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Pending' ? isPending :
      comp.status === 'Resolved';

    const matchesSearch = 
      searchQuery === '' ||
      comp.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.instrumentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.issueCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.locationAddress && comp.locationAddress.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Flag status helper based on progressive flagging engine
  const getFlagStatusForInstrument = (instrumentId: string) => {
    const inst = instruments.find(i => i.id === instrumentId);
    const count = inst?.complaintsCount ?? (complaints.filter(c => c.instrumentId === instrumentId).length);
    if (count >= 3 || inst?.flagStatus === 'red') {
      return { level: 'red', label: 'Red Flag (3+ Complaints)', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
    if (count === 2 || inst?.flagStatus === 'yellow') {
      return { level: 'yellow', label: 'Yellow Flag (2 Complaints)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    return { level: 'green', label: 'Green Flag (0–1 Complaints)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  return (
    <div className="space-y-5">
      {/* Metrics Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">Total Complaints Received</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalComplaints}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Lodged via Public QR Stamping</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Complaints</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{pendingComplaints}</p>
          <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">Awaiting inspection or legal hearing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">Red-Flagged Vendors (3+)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600">{redFlaggedVendorsCount}</p>
          <span className="text-[11px] text-rose-700 font-medium mt-0.5 block">Auto-escalated by progressive flagging</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Filter:</span>
          {(['All', 'Pending', 'Resolved'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                statusFilter === tab
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'All' ? `All Complaints (${complaints.length})` : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search vendor, serial no., locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-600"
          />
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Merchant / Shop Address</th>
                <th className="py-3 px-4">Machine ID / Serial</th>
                <th className="py-3 px-4">Complainant & Geo-Tag</th>
                <th className="py-3 px-4">Discrepancy Category</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Progressive Flag</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No complaints match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((comp) => {
                  const flag = getFlagStatusForInstrument(comp.instrumentId);

                  // Mask mobile number for citizen privacy (e.g. +91 98201 ***00)
                  const maskedMobile = comp.consumerMobile 
                    ? comp.consumerMobile.replace(/(\+\d{2}\s?\d{5})\d{3}(\d{2})/, '$1***$2')
                    : '+91 98201 ***21';

                  return (
                    <tr key={comp.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate max-w-[180px]">{comp.businessName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5">
                          {comp.locationAddress || comp.shopLocation}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                          {comp.instrumentId}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          QR Verified
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{comp.consumerName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{maskedMobile}</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>Geo-tagged (±{comp.gpsAccuracyMeters || 6}m)</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-rose-900 text-xs">
                          {comp.issueCategory}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate max-w-[220px] mt-0.5">
                          Commodity: <strong>{comp.commodityName}</strong> {comp.shortageGrams ? `(${comp.shortageGrams}g deficit)` : ''}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-500">
                        <span className="font-medium text-slate-800">{comp.createdAt}</span>
                        <span className="block text-[10px] text-slate-400">Via Public QR</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 w-fit ${flag.color}`}>
                          {flag.level === 'red' && <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />}
                          {flag.level === 'yellow' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                          {flag.level === 'green' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                          <span>{flag.label}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          id={`view-complaint-${comp.id}`}
                          onClick={() => setSelectedComplaint(comp)}
                          className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single "View Complaint Details" Modal / Drawer */}
      {selectedComplaint && (
        <div 
          id="complaint-detail-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div 
            id="complaint-detail-modal-card"
            className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-wider block">
                  Citizen Grievance Record
                </span>
                <h4 className="font-bold text-sm flex items-center gap-2 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Complaint #{selectedComplaint.id}</span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Merchant Info */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Merchant & Scale</span>
                <p className="font-bold text-slate-900 text-xs">{selectedComplaint.businessName}</p>
                <p className="text-slate-600">{selectedComplaint.locationAddress || selectedComplaint.shopLocation}</p>
                <p className="font-mono text-indigo-700 text-[11px] mt-1">Instrument ID: {selectedComplaint.instrumentId}</p>
              </div>

              {/* Allegation Details */}
              <div className="bg-rose-50/60 border border-rose-200 p-3.5 rounded-xl space-y-2 text-rose-950">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-900">{selectedComplaint.issueCategory}</span>
                  {selectedComplaint.shortageGrams && (
                    <span className="font-bold font-mono bg-rose-200 text-rose-900 px-2 py-0.5 rounded text-[11px]">
                      {selectedComplaint.shortageGrams}g Shortage
                    </span>
                  )}
                </div>
                <p className="text-slate-700 text-xs leading-relaxed italic">
                  "{selectedComplaint.description || 'Discrepancy reported during retail weighment transaction.'}"
                </p>
                <div className="text-[11px] text-slate-600 flex justify-between border-t border-rose-200/60 pt-1.5">
                  <span>Commodity: <strong>{selectedComplaint.commodityName}</strong></span>
                  {selectedComplaint.billedWeightKg && (
                    <span>Billed: <strong>{selectedComplaint.billedWeightKg} kg</strong></span>
                  )}
                </div>
              </div>

              {/* Geo-tagged Consumer Verification */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Complainant Verification</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Citizen Name:</span>
                    <span className="font-semibold text-slate-900">{selectedComplaint.consumerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">OTP Verified Mobile:</span>
                    <span className="font-mono text-slate-900 font-semibold">{selectedComplaint.consumerMobile}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">Geo-Tagged Location Coordinates:</span>
                    <span className="font-mono text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {selectedComplaint.gpsCoordinates 
                        ? `${selectedComplaint.gpsCoordinates.lat}° N, ${selectedComplaint.gpsCoordinates.lng}° E`
                        : '19.0825° N, 72.8415° E (Accuracy ±6m)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Remarks */}
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-950">Status: {selectedComplaint.status.replace(/_/g, ' ')}</span>
                  <span className="text-[11px] text-sky-600 font-mono">Date: {selectedComplaint.createdAt}</span>
                </div>
                {selectedComplaint.inspectorRemarks && (
                  <p className="text-[11px] text-slate-600 mt-1">
                    <strong>Official Remarks:</strong> {selectedComplaint.inspectorRemarks}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPublicInstrumentId(selectedComplaint.instrumentId)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-sky-600" />
                <span>View Public QR Scale Record</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public QR Verification Modal Preview */}
      {publicInstrumentId && (
        <PublicVerificationModal
          isOpen={!!publicInstrumentId}
          initialInstrumentId={publicInstrumentId}
          onClose={() => setPublicInstrumentId(null)}
        />
      )}
    </div>
  );
};
