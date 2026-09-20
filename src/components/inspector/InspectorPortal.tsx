import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Search, 
  Scale, 
  QrCode, 
  ShieldCheck, 
  Building2,
  Phone,
  CheckCircle2,
  Eye,
  FileText,
  AlertOctagon,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useTolSeva } from '../../context/TolSevaContext';
import { InspectionSchedule, Instrument } from '../../types';
import { InspectorStatusLeaveManager } from './InspectorStatusLeaveManager';
import { InspectionCaseDetailModal } from './InspectionCaseDetailModal';
import { CitizenGrievanceDashboard } from '../common/CitizenGrievanceDashboard';
import { PublicVerificationModal } from '../common/PublicVerificationModal';

export const InspectorPortal: React.FC = () => {
  const { 
    inspections, 
    instruments, 
    currentUser, 
    complaints, 
    inspectorAttendance,
    inspectorLeaveRecord 
  } = useTolSeva();

  // Primary tab view: Case Management vs Grievances
  const [mainView, setMainView] = useState<'cases' | 'grievances'>('cases');

  // Case management tabs: Pending, Active, Completed
  const [caseTab, setCaseTab] = useState<'pending' | 'active' | 'completed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Normal' | 'Urgent Re-Audit'>('All');

  // Modal states
  const [selectedCaseSchedule, setSelectedCaseSchedule] = useState<InspectionSchedule | null>(null);
  const [publicInstrumentId, setPublicInstrumentId] = useState<string | null>(null);

  // SLA Calculation Helper
  const getSlaBadge = (schedule: InspectionSchedule) => {
    const now = Date.now();
    // Default fallback to 24 hours if not set
    const dueTime = schedule.dueTimestamp || now + 24 * 3600 * 1000;
    const diffHours = Math.round((dueTime - now) / (3600 * 1000));
    const isOverdue = diffHours < 0;

    if (isOverdue) {
      return {
        label: `Breached (${Math.abs(diffHours)}h overdue)`,
        className: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
        isBreached: true,
      };
    }
    if (diffHours <= 24) {
      return {
        label: `Urgent (${diffHours}h left)`,
        className: 'bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse',
        isBreached: false,
      };
    }
    if (diffHours <= 72) {
      return {
        label: `${Math.ceil(diffHours / 24)}d left`,
        className: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
        isBreached: false,
      };
    }
    return {
      label: `${Math.ceil(diffHours / 24)}d left`,
      className: 'bg-slate-100 text-slate-700 border-slate-200',
      isBreached: false,
    };
  };

  // Categorize inspections into the 3 core tabs
  // 1. Pending: Scheduled/Incoming awaiting assignment, document review, or visit queueing
  // 2. Active: Currently assigned inspections that are in progress or queued for field visit on mobile
  // 3. Completed: Successfully audited scales with issued e-Certificates & stickers
  const pendingCases = inspections.filter(i => i.status === 'Pending' && i.priority !== 'Urgent Re-Audit');
  const activeCases = inspections.filter(i => i.status === 'Pending' && (i.priority === 'Urgent Re-Audit' || i.priority === 'High' || i.triggeredByComplaint));
  const completedCases = inspections.filter(i => i.status === 'Completed');

  // Pick list based on selected tab
  const getActiveTabList = () => {
    switch (caseTab) {
      case 'pending':
        return pendingCases;
      case 'active':
        return activeCases;
      case 'completed':
        return completedCases;
    }
  };

  const currentTabList = getActiveTabList();

  const filteredCases = currentTabList.filter(item => {
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const matchesSearch = searchQuery === '' ||
      item.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instrumentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shopLocation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPriority && matchesSearch;
  });

  const getInstrumentForSchedule = (instrumentId: string): Instrument | undefined => {
    return instruments.find(i => i.id === instrumentId);
  };

  return (
    <div className="space-y-6">
      {/* Inspector Profile & Jurisdictional Header with Attendance Status */}
      <div 
        id="inspector-header-banner"
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 px-2.5 py-0.5 rounded border border-indigo-700/50">
                Department of Consumer Affairs • Legal Metrology Desktop Portal
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                DigiLocker KYC Verified
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{currentUser?.name || 'Officer Sunita Patil'}</span>
            </h2>
            <p className="text-xs text-indigo-200 flex flex-wrap items-center gap-3">
              <span>{currentUser?.designation || 'Senior Legal Metrology Officer (Class-I)'}</span>
              <span>•</span>
              <span>Jurisdiction: {currentUser?.district || 'Mumbai Central & Suburbs'}</span>
              <span>•</span>
              <span className="font-mono">ID: {currentUser?.identifier || 'INS-MAH-409'}</span>
            </p>
          </div>

          {/* Inspector Attendance & Leave Manager Widget */}
          <div className="shrink-0 flex items-center gap-3">
            <InspectorStatusLeaveManager />
          </div>
        </div>

        {/* Leave Warning Banner if Inspector is on leave */}
        {inspectorAttendance === 'on_leave' && inspectorLeaveRecord && (
          <div 
            id="inspector-on-leave-alert-banner"
            className="mt-4 p-3 bg-rose-500/20 border border-rose-400/40 rounded-xl flex items-center justify-between text-xs text-rose-200 backdrop-blur-xs"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Officer Unavailable:</strong> Currently on {inspectorLeaveRecord.leaveReason} from {inspectorLeaveRecord.startDate} to {inspectorLeaveRecord.endDate}. 
                Pending visits have been automatically queued for Higher Authority Admin re-routing.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Switcher: Case Management vs Grievance Log */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="inspector-cases-tab-btn"
            onClick={() => setMainView('cases')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              mainView === 'cases'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Inspection Case Management</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              mainView === 'cases' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {inspections.length}
            </span>
          </button>

          <button
            type="button"
            id="inspector-grievances-tab-btn"
            onClick={() => setMainView('grievances')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              mainView === 'grievances'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Citizen Grievance Log</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-extrabold">
              {complaints.length}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Field verifications are conducted via the <strong>Inspector Mobile Tool</strong></span>
        </div>
      </div>

      {mainView === 'cases' ? (
        <div className="space-y-6">
          {/* Dashboard Metrics Cards (Active, Pending, Completed, Leave Status) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-amber-600 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Cases</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-amber-700">{pendingCases.length}</p>
              <span className="text-[11px] text-slate-500 mt-1 block">Awaiting schedule review / slot</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-indigo-600 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">Active Queue</span>
                <Calendar className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-extrabold text-indigo-700">{activeCases.length}</p>
              <span className="text-[11px] text-indigo-600 font-medium mt-1 block">Queued on Mobile Tool</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">Completed Cases</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-700">{completedCases.length}</p>
              <span className="text-[11px] text-slate-500 mt-1 block">e-Certificates & stickers issued</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-600 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">Inspector Status</span>
                <span className={`w-2.5 h-2.5 rounded-full ${inspectorAttendance === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </div>
              <p className={`text-sm font-extrabold mt-1 ${inspectorAttendance === 'active' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {inspectorAttendance === 'active' ? 'Active / On Duty' : 'On Leave'}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {inspectorAttendance === 'active' ? 'Receiving field queues' : 'Re-routing flagged'}
              </span>
            </div>
          </div>

          {/* 3 Core Case Tabs: Pending Cases, Active Cases, Completed Cases */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
            {/* 3 Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="case-tab-pending"
                onClick={() => setCaseTab('pending')}
                className={`px-3.5 py-2 rounded-lg font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
                  caseTab === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🟡 Pending Cases</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] ${caseTab === 'pending' ? 'bg-amber-700 text-white' : 'bg-white text-slate-700'}`}>
                  {pendingCases.length}
                </span>
              </button>

              <button
                type="button"
                id="case-tab-active"
                onClick={() => setCaseTab('active')}
                className={`px-3.5 py-2 rounded-lg font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
                  caseTab === 'active'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🔵 Active Cases</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] ${caseTab === 'active' ? 'bg-indigo-700 text-white' : 'bg-white text-slate-700'}`}>
                  {activeCases.length}
                </span>
              </button>

              <button
                type="button"
                id="case-tab-completed"
                onClick={() => setCaseTab('completed')}
                className={`px-3.5 py-2 rounded-lg font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
                  caseTab === 'completed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🟢 Completed Cases</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] ${caseTab === 'completed' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700'}`}>
                  {completedCases.length}
                </span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search trader, serial, scale ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Case Cards List */}
          <div className="space-y-3.5">
            {filteredCases.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-800 text-sm">No cases found in this category.</p>
                <p className="text-xs text-slate-400">Cases will appear here when scheduled or updated by traders.</p>
              </div>
            ) : (
              filteredCases.map((item) => {
                const sla = getSlaBadge(item);
                const isUrgent = item.priority === 'Urgent Re-Audit';
                const inst = getInstrumentForSchedule(item.instrumentId);

                return (
                  <div
                    key={item.id}
                    id={`case-card-${item.id}`}
                    className={`bg-white border rounded-xl p-5 transition shadow-xs space-y-4 hover:border-indigo-300 ${
                      isUrgent
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Top Row: IDs, Priority, SLA Timer, Status */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {item.id}
                        </span>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isUrgent
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : item.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.priority}
                        </span>

                        {/* Complaint-Linked Priority Tag */}
                        {item.triggeredByComplaint && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Complaint Priority ({item.complaintCount || 2}+ Complaints)</span>
                          </span>
                        )}

                        {/* SLA Due Date and Real-time Badge */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-500">Due:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {item.dueDate || '24 Sep 2026, 05:00 PM'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sla.className}`}>
                            {sla.label}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === 'Pending' && <Clock className="w-3 h-3" />}
                          <span>{item.status}</span>
                        </span>

                        {item.flagStatus === 'red' && (
                          <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                            RED FLAGGED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Merchant info & Scale details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Merchant / Trader</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.businessName}</h4>
                        <p className="text-slate-600 truncate">{item.shopLocation}</p>
                        <p className="text-slate-500 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{item.vendorName} ({item.contact})</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Instrument Specifications</span>
                        <p className="font-semibold text-slate-800 text-xs mt-0.5">{item.category}</p>
                        <p className="font-mono text-indigo-700">Serial No: {item.serialNumber}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Scale Ref: {item.instrumentId}</p>
                      </div>

                      {/* Desktop Action Buttons: Single "View Details" + Public QR Preview */}
                      <div className="flex flex-col justify-end space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            id={`view-details-${item.id}`}
                            onClick={() => setSelectedCaseSchedule(item)}
                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPublicInstrumentId(item.instrumentId)}
                            className="p-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-lg transition cursor-pointer"
                            title="Preview Public Citizen QR Certificate"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-[10px] text-slate-400 text-right">
                          Inspection execution handled via mobile app
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Citizen Grievance Dashboard View */
        <CitizenGrievanceDashboard viewRole="inspector" />
      )}

      {/* Case Dossier Detail Modal */}
      {selectedCaseSchedule && (
        <InspectionCaseDetailModal
          schedule={selectedCaseSchedule}
          instrument={getInstrumentForSchedule(selectedCaseSchedule.instrumentId)}
          isOpen={!!selectedCaseSchedule}
          onClose={() => setSelectedCaseSchedule(null)}
          onOpenPublicQr={(id) => setPublicInstrumentId(id)}
        />
      )}

      {/* Public Citizen QR Web Verification View */}
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
