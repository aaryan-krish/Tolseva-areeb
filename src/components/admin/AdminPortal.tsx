import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Activity, 
  TrendingUp, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Scale, 
  FileText, 
  BarChart3, 
  RefreshCw,
  Search,
  Building2,
  DollarSign,
  Layers,
  Flame
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  AreaChart, 
  Area,
  CartesianGrid 
} from 'recharts';
import { useTolSeva } from '../../context/TolSevaContext';
import { Instrument, InspectionSchedule } from '../../types';
import { DISTRICT_ANALYTICS } from '../../data/mockData';
import { ReAuditModal } from './ReAuditModal';
import { CitizenGrievanceDashboard } from '../common/CitizenGrievanceDashboard';

export const AdminPortal: React.FC = () => {
  const { instruments, gpsLogs, penalties, currentUser, inspections, complaints, inspectorAttendance } = useTolSeva();

  const [activeTab, setActiveTab] = useState<'overview' | 'flagging' | 'grievances' | 'analytics' | 'penalties'>('overview');
  const [flagFilter, setFlagFilter] = useState<'All' | 'red' | 'yellow' | 'green'>('All');
  const [selectedRedFlagInstrument, setSelectedRedFlagInstrument] = useState<Instrument | null>(null);
  const [searchMerchant, setSearchMerchant] = useState('');

  // Metrics
  const totalScales = instruments.length;
  const redFlags = instruments.filter(i => i.flagStatus === 'red');
  const yellowFlags = instruments.filter(i => i.flagStatus === 'yellow');
  const greenFlags = instruments.filter(i => i.flagStatus === 'green');

  // SLA Breach Tracking
  const now = Date.now();
  const breachedInspections = inspections.filter(i => i.status === 'Pending' && (i.dueTimestamp ? i.dueTimestamp < now : false));
  const urgentSlaInspections = inspections.filter(i => {
    if (i.status !== 'Pending' || !i.dueTimestamp) return false;
    const diffHours = (i.dueTimestamp - now) / (3600 * 1000);
    return diffHours >= 0 && diffHours <= 24;
  });

  const totalPenaltiesCollected = penalties
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.penaltyAmount, 0);

  const pendingPenalties = penalties
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.penaltyAmount, 0);

  // Filter instruments for Progressive Flagging Engine
  const filteredFlaggedInstruments = instruments.filter(inst => {
    const matchesFlag = flagFilter === 'All' || inst.flagStatus === flagFilter;
    const matchesSearch = searchMerchant === '' || 
      inst.businessName.toLowerCase().includes(searchMerchant.toLowerCase()) ||
      inst.district.toLowerCase().includes(searchMerchant.toLowerCase()) ||
      inst.serialNumber.toLowerCase().includes(searchMerchant.toLowerCase());
    return matchesFlag && matchesSearch;
  });

  // CSV Export with SLA Status and Grievances
  const handleExportCSV = () => {
    const headers = 'Instrument ID,Merchant Name,Category,Capacity (kg),District,Flag Status,Complaints Count,SLA Status,Due Date,Fee Paid (INR)\n';
    const rows = instruments.map(i => {
      const schedule = inspections.find(s => s.instrumentId === i.id);
      let slaStatus = 'On Schedule (Normal 7-14d)';
      if (i.flagStatus === 'red') {
        const isBreached = schedule?.dueTimestamp ? schedule.dueTimestamp < now : false;
        slaStatus = isBreached ? 'BREACHED (Red-Flag 24-48h SLA)' : 'Active (Red-Flag 24-48h SLA)';
      } else if (i.flagStatus === 'yellow') {
        slaStatus = 'Active (Yellow-Flag 3-5d SLA)';
      }
      const dueDate = schedule?.dueDate || 'N/A';
      return `"${i.id}","${i.businessName}","${i.category}",${i.capacityKg},"${i.district}","${i.flagStatus}",${i.complaintsCount},"${slaStatus}","${dueDate}",${i.feePaid}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TolSeva_State_Audit_SLA_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Directorate Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-700/50">
                Ministry of Consumer Affairs • Apex Regulatory Directorate
              </span>
              <span className="text-xs text-indigo-300 font-mono">
                Smart India Hackathon 2026
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {currentUser?.name || 'Dr. Amitabh Sen, IAS'}
            </h2>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
              <span>{currentUser?.designation || 'Joint Director of Legal Metrology & Controller'}</span>
              <span>•</span>
              <span>Headquarters: Mumbai Apex Directorate</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">State-Wide Real-Time SLA: 96.4%</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export State Audit CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">SLA Breaches</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600">{breachedInspections.length}</p>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">
            {urgentSlaInspections.length} urgent (&lt;24h)
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Progressive Red Flags</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600">{redFlags.length}</p>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">3+ Complaints (Immediate Action)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Yellow Warnings</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{yellowFlags.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">2 Consumer Complaints logged</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Clean Compliant (Green)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{greenFlags.length}</p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Zero tolerance variance</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Penalties Realized</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{(totalPenaltiesCollected / 1000).toFixed(1)}k</p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">₹{(pendingPenalties / 1000).toFixed(1)}k recovery in progress</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Real-Time Activity & GPS Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab('flagging')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'flagging'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Progressive Flagging & Re-Audit Queue ({redFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('grievances')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'grievances'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Citizen Grievance Registry ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>State-Wide Fraud Hotspots & Heatmap</span>
        </button>

        <button
          onClick={() => setActiveTab('penalties')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'penalties'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Section 30/36 Penalties Log</span>
        </button>
      </div>

      {/* Tab: Real-Time Activity & GPS Tracking */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live GPS Audit Stream */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Real-Time Inspector Visits & GPS Audit Log Stream</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live encrypted geofence telemetry verifying physical officer presence on-site.
                </p>
              </div>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                Telemetry Frequency: 5s
              </span>
            </div>

            <div className="space-y-3">
              {gpsLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.inspectorName}</span>
                      <span className="font-mono text-[10px] text-slate-400">({log.inspectorId})</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                        {log.district}
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium">{log.action}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="font-mono">{log.location}</span>
                      </span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                      log.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {log.status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{log.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics & Anti-Collusion Engine */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                <span>Anti-Collusion SLA Monitor</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">7-Day Verification Turnaround SLA:</span>
                    <span className="font-bold text-emerald-600">96.4%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Geofenced Check-in Accuracy:</span>
                    <span className="font-bold text-indigo-600">98.1%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '98.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Re-Audit Clearance Rate:</span>
                    <span className="font-bold text-amber-600">82.0%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '82.0%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-950 text-white rounded-xl p-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded">
                Autonomous Anti-Collusion Protocol
              </span>
              <h4 className="text-sm font-bold text-white">Algorithmic Neutral Officer Dispatch</h4>
              <p className="text-xs text-indigo-200 leading-relaxed">
                When a merchant accumulates 3+ consumer cheating complaints, the platform automatically revokes local field officer jurisdiction and re-routes re-inspection to external flying squads.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Progressive Flagging Engine & Re-Audit Queue */}
      {activeTab === 'flagging' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Flag Filter:</span>
              {(['All', 'red', 'yellow', 'green'] as const).map(flg => (
                <button
                  key={flg}
                  onClick={() => setFlagFilter(flg)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase text-[11px] transition ${
                    flagFilter === flg
                      ? flg === 'red'
                        ? 'bg-rose-600 text-white'
                        : flg === 'yellow'
                        ? 'bg-amber-500 text-white'
                        : flg === 'green'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {flg === 'red' ? 'Red Flag (3+)' : flg === 'yellow' ? 'Yellow Flag (2)' : flg === 'green' ? 'Green Flag (0-1)' : 'All Flags'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by merchant, serial..."
                value={searchMerchant}
                onChange={(e) => setSearchMerchant(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Flagging Queue Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Merchant & Location</th>
                  <th className="py-3 px-4">Instrument Specification</th>
                  <th className="py-3 px-4 text-center">Complaints</th>
                  <th className="py-3 px-4 text-center">Progressive Flag</th>
                  <th className="py-3 px-4">Assigned Inspector</th>
                  <th className="py-3 px-4 text-right">Actionable Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFlaggedInstruments.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{inst.businessName}</p>
                      <p className="text-slate-500 text-[11px]">{inst.shopLocation}, {inst.district}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{inst.brandModel} ({inst.capacityKg}kg)</p>
                      <p className="font-mono text-slate-500 text-[11px]">S/N: {inst.serialNumber}</p>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-sm text-slate-800">
                        {inst.complaintsCount}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          inst.flagStatus === 'red'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : inst.flagStatus === 'yellow'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inst.flagStatus === 'red'
                              ? 'bg-rose-600 animate-ping'
                              : inst.flagStatus === 'yellow'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span>{inst.flagStatus} Flag</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 text-[11px]">{inst.assignedInspectorName || 'Officer Sunita Patil'}</p>
                      <p className="text-[10px] text-slate-400">Jurisdiction Officer</p>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {inst.flagStatus === 'red' ? (
                        <button
                          onClick={() => setSelectedRedFlagInstrument(inst)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] transition shadow-xs flex items-center gap-1 ml-auto"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Assign Neutral Re-Audit</span>
                        </button>
                      ) : inst.flagStatus === 'yellow' ? (
                        <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          Automated Warning Dispatched
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          Fully Compliant
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Citizen Grievance Registry (Read-only Log) */}
      {activeTab === 'grievances' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Apex Directorate Citizen Grievance Registry</span>
              </h3>
              <p className="text-xs text-slate-500">
                Centralized statutory registry of complaints lodged via public holographic QR stamps across Maharashtra.
              </p>
            </div>
          </div>

          <CitizenGrievanceDashboard viewRole="admin" />
        </div>
      )}

      {/* Tab: State-Wide Fraud Hotspots & Heatmap Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: District Risk & Hotspots */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>District-Wise Fraud Risk & Red Flag Density</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algorithmic risk score based on consumer complaints, tolerance breaches, and broken lead seals.
                </p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DISTRICT_ANALYTICS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="compliant" name="Compliant Scales" fill="#10B981" />
                    <Bar dataKey="yellowFlagged" name="Yellow Warnings" fill="#F59E0B" />
                    <Bar dataKey="redFlagged" name="Red Flags (Cheating)" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Fraud Risk Score Area Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Vigilance Hotspot Index by Jurisdiction</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-risk zones trigger autonomous surveillance drones & neutral flying squads.
                </p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DISTRICT_ANALYTICS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="fraudRiskScore" name="Fraud Risk Index" stroke="#6366F1" fill="#EEF2FF" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Interactive District Heatmap Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>State-Wide Jurisdiction Metrology Status Matrix</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DISTRICT_ANALYTICS.map((dist) => (
                <div
                  key={dist.district}
                  className={`p-3.5 rounded-xl border transition ${
                    dist.fraudRiskScore >= 40
                      ? 'bg-rose-50/60 border-rose-200'
                      : dist.fraudRiskScore >= 30
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-emerald-50/60 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{dist.district}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        dist.fraudRiskScore >= 40
                          ? 'bg-rose-200 text-rose-900'
                          : dist.fraudRiskScore >= 30
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      Risk: {dist.fraudRiskScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 mt-2">
                    <div>Inspected: <span className="font-semibold">{dist.totalInspected}</span></div>
                    <div>Compliant: <span className="font-semibold text-emerald-700">{dist.compliant}</span></div>
                    <div>Warnings: <span className="font-semibold text-amber-700">{dist.yellowFlagged}</span></div>
                    <div>Red Flags: <span className="font-semibold text-rose-700">{dist.redFlagged}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Penalties Management */}
      {activeTab === 'penalties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Section 30 & 36 Statutory Penalty Compounding Registry</span>
            </h3>
            <span className="text-xs text-slate-500">
              Penalties levied under Legal Metrology Act, 2009 for under-weighing and broken seals
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Penalty Case ID</th>
                  <th className="py-3 px-4">Commercial Entity & GSTIN</th>
                  <th className="py-3 px-4">Violation Section</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Penalty Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {penalties.map((pen) => (
                  <tr key={pen.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{pen.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{pen.merchantName}</p>
                      <p className="font-mono text-slate-400 text-[11px]">{pen.gstin}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{pen.violationSection}</td>
                    <td className="py-3 px-4 text-slate-600">{pen.district}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{pen.penaltyAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          pen.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pen.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Re-Audit Dispatch Modal */}
      {selectedRedFlagInstrument && (
        <ReAuditModal
          instrument={selectedRedFlagInstrument}
          isOpen={!!selectedRedFlagInstrument}
          onClose={() => setSelectedRedFlagInstrument(null)}
        />
      )}
    </div>
  );
};
