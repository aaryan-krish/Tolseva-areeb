import React, { useState } from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Send, 
  Plus, 
  FileText, 
  ShieldAlert, 
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { useTolSeva } from '../../context/TolSevaContext';
import { DisputeTicket } from '../../types';

export const VendorDisputes: React.FC = () => {
  const { disputes, instruments, createDisputeTicket, currentUser } = useTolSeva();
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'Pending' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [selectedInstrumentId, setSelectedInstrumentId] = useState(instruments[0]?.id || '');
  const [category, setCategory] = useState<DisputeTicket['category']>('Inspector Delay');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<DisputeTicket['priority']>('Medium');

  const vendorDisputes = disputes.filter(d => 
    (filterStatus === 'All' || d.status === filterStatus) &&
    (searchQuery === '' || 
      d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    createDisputeTicket({
      instrumentId: selectedInstrumentId,
      subject,
      category,
      description,
      priority,
    });

    setSubject('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>Vendor Grievance & Dispute Redressal Portal</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Log official complaints regarding inspector delays, tolerance disagreements, or harassment under Consumer Affairs Ombudsman.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Lodge New Dispute Ticket</span>
        </button>
      </div>

      {/* New Ticket Form Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h4 className="font-bold text-sm">Lodge Legal Metrology Dispute Ticket</h4>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Associated Weighing Instrument
                </label>
                <select
                  value={selectedInstrumentId}
                  onChange={(e) => setSelectedInstrumentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  {instruments.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.brandModel} ({inst.serialNumber}) - {inst.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Grievance Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DisputeTicket['category'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Inspector Delay">Inspector Delay (7-Day Breach)</option>
                    <option value="Calibration Dispute">Calibration Dispute (Tolerance Issue)</option>
                    <option value="Fee Dispute">Fee / Receipt Issue</option>
                    <option value="Portal Technical Issue">Portal Technical Issue</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as DisputeTicket['priority'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Low">Low - Informational</option>
                    <option value="Medium">Medium - Normal Attention</option>
                    <option value="High">High - Impending Expiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Subject / Summary of Complaint
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Field inspector did not arrive within 5 days of token issuance"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Detailed Explanation & Circumstances
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise details, dates, and inspector communication details..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Ombudsman</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-400 font-medium">Status Filter:</span>
          {(['All', 'Open', 'Pending', 'Resolved'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tickets by ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Disputes Ticket Cards */}
      <div className="space-y-3">
        {vendorDisputes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No dispute tickets found matching the selected filter.
          </div>
        ) : (
          vendorDisputes.map(ticket => (
            <div
              key={ticket.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {ticket.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                    {ticket.category}
                  </span>
                  <span className="text-xs text-slate-400">• Ref: {ticket.instrumentId}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    ticket.status === 'Open'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : ticket.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {ticket.status === 'Open' && <AlertCircle className="w-3 h-3" />}
                    {ticket.status === 'Pending' && <Clock className="w-3 h-3" />}
                    {ticket.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                    <span>{ticket.status}</span>
                  </span>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    ticket.priority === 'High'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{ticket.subject}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              {ticket.resolutionNotes && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                  <span className="font-bold text-indigo-900 block">
                    Officer Action / Resolution Remarks:
                  </span>
                  <p className="text-slate-700">{ticket.resolutionNotes}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Filed: {ticket.createdAt}</span>
                <span>Assigned Officer: <span className="font-semibold text-slate-700">{ticket.assignedOfficer || 'Legal Metrology Cell'}</span></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
