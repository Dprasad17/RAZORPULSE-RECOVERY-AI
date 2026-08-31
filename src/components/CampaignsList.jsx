import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  ExternalLink, 
  Copy, 
  ChevronRight, 
  ArrowRight,
  User,
  ShieldAlert,
  Check,
  Bot,
  Layers,
  ShieldCheck,
  LayoutGrid,
  List,
  SlidersHorizontal,
  FileText,
  X,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';

export default function CampaignsList({ campaigns = [], onNavigateToCustomerPortal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filtered = campaigns.filter(c => {
    const matchesSearch = 
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.plan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter || (statusFilter === 'HALTED' && c.status.includes('HALTED'));

    return matchesSearch && matchesStatus;
  });

  const totalAmountRecovered = campaigns.filter(c => c.status === 'RECOVERED').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRecoveredCount = campaigns.filter(c => c.status === 'RECOVERED').length;
  const totalHaltedCount = campaigns.filter(c => c.status.includes('HALTED')).length;
  const totalDeferredCount = campaigns.filter(c => c.status.includes('DEFERRED')).length;

  const handleCopyLink = (campaignId, linkUrl) => {
    navigator.clipboard.writeText(linkUrl || `${window.location.origin}/#/recover/${campaignId}`);
    setCopiedId(campaignId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Directory Metric Cards Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rz-card p-4 bg-[#08101d] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 font-bold uppercase">Total Incidents</div>
          <div className="text-2xl font-black text-white mt-1 font-display">{campaigns.length}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Ingested via Webhooks</div>
        </div>

        <div className="rz-card p-4 bg-[#08101d] border border-emerald-500/30">
          <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Settled Recoveries</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-display">{totalRecoveredCount}</div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">₹{(totalAmountRecovered / 1000).toFixed(0)}k Retained ARR</div>
        </div>

        <div className="rz-card p-4 bg-[#08101d] border border-amber-500/30">
          <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">DND Deferrals</div>
          <div className="text-2xl font-black text-amber-400 mt-1 font-display">{totalDeferredCount}</div>
          <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">TRAI Contact Window Policy</div>
        </div>

        <div className="rz-card p-4 bg-[#08101d] border border-rose-500/30">
          <div className="text-[11px] font-mono text-rose-400 font-bold uppercase">Policy Halts</div>
          <div className="text-2xl font-black text-rose-400 mt-1 font-display">{totalHaltedCount}</div>
          <div className="text-[10px] text-rose-400/80 font-mono mt-0.5">Hard Decline / Fraud Protection</div>
        </div>
      </div>

      {/* Control Toolbar: Search, Filters & Grid/Table Switcher */}
      <div className="rz-card p-4 bg-[#080d1a] border border-[#0284c7]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by customer, email, plan or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs font-sans">
            {['ALL', 'RECOVERED', 'IN_RECOVERY', 'HALTED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-[#0284c7] text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-[#0284c7] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-[#0284c7] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Data Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW 1: MODERN OBSIDIAN GRID CARDS */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div 
              key={item.id} 
              className="rz-card p-5 bg-[#080e1b] border border-slate-800 hover:border-[#0284c7]/50 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Row: ID + Status Badge */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="font-mono text-xs font-bold text-[#38bdf8] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#38bdf8]" /> {item.id}
                  </span>
                  <div>
                    {item.status === 'RECOVERED' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                        ✓ RECOVERED
                      </span>
                    )}
                    {item.status.includes('HALTED') && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono">
                        ✕ HALTED ({item.status.replace('HALTED_', '')})
                      </span>
                    )}
                    {item.status.includes('DEFERRED') && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono">
                        ⏱ DEFERRED (DND)
                      </span>
                    )}
                    {item.status === 'IN_RECOVERY' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0284c7]/15 text-[#38bdf8] border border-[#0284c7]/30 font-mono">
                        ⚡ IN RECOVERY
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <div className="text-sm font-bold text-white font-display flex items-center justify-between">
                    <span>{item.customerName}</span>
                    <span className="font-mono text-emerald-400 text-sm font-black">₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">{item.plan}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.email}</div>
                </div>

                {/* Failure Category & Risk Pill */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">Failure Cause:</span>
                    <span className="text-rose-400 font-bold">{item.failureReasonCategory || "Gateway Timeout"}</span>
                  </div>
                  <div className="text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">Churn Risk Score:</span>
                    <span className={`font-bold ${item.riskScore > 80 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {item.riskScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCampaign(item)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer text-center"
                >
                  Inspect Audit Drawer
                </button>

                {item.status !== 'RECOVERED' && !item.status.includes('HALTED') && (
                  <button
                    onClick={() => onNavigateToCustomerPortal(item.id)}
                    className="py-2 px-3 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] text-slate-950 text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Recover <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rz-card p-12 text-center text-slate-500 font-sans">
              No active recovery incidents match your search filter.
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DATA TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rz-card overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-5 py-3">Incident ID</th>
                  <th className="px-5 py-3">Customer & Plan</th>
                  <th className="px-5 py-3">Amount (₹)</th>
                  <th className="px-5 py-3">Failure Category</th>
                  <th className="px-5 py-3">Risk Score</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right font-sans">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-[#38bdf8]">
                      {item.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{item.customerName}</div>
                      <div className="text-[11px] text-slate-400">{item.plan}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-white font-mono">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-200 max-w-xs truncate">{item.failureReasonText}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Channel: {item.channelUsed}</div>
                    </td>
                    <td className="px-5 py-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.riskScore > 80 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.riskScore}/100
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {item.status === 'RECOVERED' && <span className="text-emerald-400 font-bold font-mono">✓ RECOVERED</span>}
                      {item.status.includes('HALTED') && <span className="text-rose-400 font-bold font-mono">✕ HALTED</span>}
                      {item.status.includes('DEFERRED') && <span className="text-amber-400 font-bold font-mono">⏱ DEFERRED</span>}
                      {item.status === 'IN_RECOVERY' && <span className="text-[#38bdf8] font-bold font-mono">⚡ IN RECOVERY</span>}
                    </td>
                    <td className="px-5 py-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCampaign(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Inspect Audit
                        </button>
                        {item.status !== 'RECOVERED' && !item.status.includes('HALTED') && (
                          <button
                            onClick={() => onNavigateToCustomerPortal(item.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#38bdf8] hover:bg-[#0284c7] text-slate-950 text-[11px] font-extrabold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            Recover <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Drawer Side Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-end p-0 sm:p-4">
          <div className="rz-card w-full sm:max-w-2xl h-full sm:h-auto max-h-screen sm:max-h-[90vh] bg-[#090f1d] p-6 space-y-5 overflow-y-auto border-l sm:border border-[#0284c7]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-[#38bdf8] font-bold">{selectedCampaign.id}</span>
                <h3 className="text-lg font-bold text-white font-display">{selectedCampaign.customerName}</h3>
                <p className="text-xs text-slate-400">Machine-Readable Audit Trail & Policy Matrix</p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Incident Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono">
              <div><span className="text-slate-400 block text-[10px]">PLAN</span> <span className="font-semibold text-white block truncate">{selectedCampaign.plan}</span></div>
              <div><span className="text-slate-400 block text-[10px]">AMOUNT</span> <span className="font-semibold text-emerald-400 block">₹{selectedCampaign.amount.toLocaleString('en-IN')}</span></div>
              <div><span className="text-slate-400 block text-[10px]">STATUS</span> <span className="font-bold text-[#38bdf8] block">{selectedCampaign.status}</span></div>
              <div><span className="text-slate-400 block text-[10px]">DISCOUNT</span> <span className="font-mono text-emerald-400 block">{selectedCampaign.discountApplied || 'None'}</span></div>
            </div>

            {/* Machine Readable Stepper */}
            {selectedCampaign.machineAuditTrail && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> Agent Execution Trace Pipeline
                </div>
                <div className="space-y-2">
                  {selectedCampaign.machineAuditTrail.map((stepObj, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#38bdf8] font-bold">Step 0{stepObj.step}: {stepObj.stage}</span>
                      </div>
                      <div className="text-slate-300 text-[11px] font-sans">{stepObj.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4-Tier Escalation Schedule */}
            {selectedCampaign.escalationMatrix && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-[#38bdf8] flex items-center gap-1.5 font-display">
                  <Layers className="w-4 h-4" /> 4-Tier Compliant Escalation Matrix
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCampaign.escalationMatrix.map(esc => (
                    <div key={esc.stage} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="font-bold text-white flex items-center justify-between text-[11px] font-mono">
                        <span>{esc.title}</span>
                        <span className="text-slate-400 text-[10px]">{esc.timeframe}</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">{esc.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => handleCopyLink(selectedCampaign.id, selectedCampaign.recoveryLink)}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-white flex items-center gap-1.5 cursor-pointer font-mono border border-slate-800"
              >
                {copiedId === selectedCampaign.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === selectedCampaign.id ? "Link Copied!" : "Copy Payment Link"}
              </button>

              {selectedCampaign.status !== 'RECOVERED' && !selectedCampaign.status.includes('HALTED') && (
                <button
                  onClick={() => {
                    const id = selectedCampaign.id;
                    setSelectedCampaign(null);
                    onNavigateToCustomerPortal(id);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  Open Recovery Portal <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
