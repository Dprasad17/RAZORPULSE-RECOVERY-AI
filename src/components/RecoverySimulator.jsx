import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Mail, 
  ExternalLink, 
  Copy, 
  Bot, 
  Cpu, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Sliders,
  HelpCircle,
  Building2,
  Lock
} from 'lucide-react';

export default function RecoverySimulator({ onSimulate, onNavigateToCustomerPortal }) {
  const [mode, setMode] = useState('batch'); // 'batch' | 'single'
  const [batchSize, setBatchSize] = useState(50);
  const [batchLoading, setBatchLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [batchResult, setBatchResult] = useState(null);
  const [expandedItemAudit, setExpandedItemAudit] = useState(null);

  // Single mode states
  const [formData, setFormData] = useState({
    customerName: "Aarav Sharma",
    email: "aarav.s@techinnovate.io",
    phone: "+91 98989 12345",
    amount: 14999,
    plan: "Enterprise Pro SaaS (Annual)",
    failureReason: "bank_outage",
    rawErrorMessage: "HDFC Bank NetBanking Gateway Timeout (HTTP 504)",
    paymentMethod: "card",
    language: "en",
    isB2B: false,
    poNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const presetScenarios = [
    {
      name: "Bank Network Outage (HDFC Node Timeout)",
      reason: "bank_outage",
      rawError: "HDFC NetBanking Gateway Timeout (HTTP 504)",
      amount: 14999,
      method: "netbanking",
      isB2B: false
    },
    {
      name: "Soft Decline (Insufficient Card Balance)",
      reason: "insufficient_funds",
      rawError: "Card Payment Declined: Insufficient Funds / Credit Limit",
      amount: 4999,
      method: "card",
      isB2B: false
    },
    {
      name: "B2B Overdue Corporate Invoice (Net 30)",
      reason: "b2b_invoice",
      rawError: "B2B Accounts Payable Settlement Overdue (Net 30)",
      amount: 48500,
      method: "neft",
      isB2B: true,
      poNumber: "PO-2026-9814"
    },
    {
      name: "NPCI Mandate Re-Authorization Dropped",
      reason: "mandate_failed",
      rawError: "NPCI E-Mandate Execution Failed: Customer Auth Required",
      amount: 12000,
      method: "mandate",
      isB2B: false
    },
    {
      name: "Hard Decline (Stolen/Lost Card Flagged)",
      reason: "stolen_card",
      rawError: "Hard Decline: Stolen/Lost Card Flagged by Issuer Bank",
      amount: 18999,
      method: "card",
      isB2B: false
    }
  ];

  const handleApplyPreset = (scenario) => {
    setFormData(prev => ({
      ...prev,
      failureReason: scenario.reason,
      rawErrorMessage: scenario.rawError,
      amount: scenario.amount,
      paymentMethod: scenario.method,
      isB2B: !!scenario.isB2B,
      poNumber: scenario.poNumber || ""
    }));
  };

  const handleRunBatch = async () => {
    setBatchLoading(true);
    setBatchResult(null);
    setLoadingStep(1);

    // Simulated progress loader steps
    setTimeout(() => setLoadingStep(2), 400);
    setTimeout(() => setLoadingStep(3), 800);
    setTimeout(() => setLoadingStep(4), 1200);

    try {
      const res = await fetch('/api/simulate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize })
      });
      const data = await res.json();
      if (data.success) {
        setBatchResult(data.batchResult);
        if (onSimulate) onSimulate();
      }
    } catch (err) {
      console.error("Batch error:", err);
    } finally {
      setBatchLoading(false);
      setLoadingStep(0);
    }
  };

  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSimulationResult(null);

    try {
      const res = await fetch('/api/simulate-failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSimulationResult(data.fullEngineResult);
        if (onSimulate) onSimulate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Console Header & Mode Switcher */}
      <div className="rz-card p-6 bg-gradient-to-r from-[#071329] via-[#0d1d3a] to-[#050914] border border-[#0284c7]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#0284c7]/15 text-[#38bdf8] border border-[#0284c7]/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-display">RECOVERY STUDIO</h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono font-bold">
                OPERATIONS CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Execute deterministic batch recovery across transactions or test single failure webhooks against policy guardrails.
            </p>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs self-start md:self-auto font-sans">
          <button
            onClick={() => setMode('batch')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              mode === 'batch'
                ? 'bg-[#0284c7] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Batch Recovery Engine
          </button>
          <button
            onClick={() => setMode('single')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              mode === 'single'
                ? 'bg-[#0284c7] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" /> Single Webhook Tester
          </button>
        </div>
      </div>

      {/* MODE 1: BATCH RECOVERY CONSOLE */}
      {mode === 'batch' && (
        <div className="space-y-6">
          <div className="rz-card p-6 bg-[#0c1322] border border-[#0284c7]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                  <TrendingUp className="w-5 h-5 text-[#38bdf8]" />
                  Batch Telemetry Runner
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Processes reproducible batch dataset through 4 AI Agents & Policy Guardrail Evaluator.
                </p>
              </div>

              {/* Batch Size Selector & Run Button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs font-mono">
                  <span className="text-slate-400 text-[11px] px-2">BATCH SIZE:</span>
                  {[25, 50].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setBatchSize(sz)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        batchSize === sz
                          ? 'bg-[#0284c7] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      [{sz}]
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRunBatch}
                  disabled={batchLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#00d2ff] to-[#10b981] text-slate-950 font-black text-sm shadow-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {batchLoading ? (
                    <>
                      <Bot className="w-4 h-4 animate-spin text-slate-950" /> RUNNING RECOVERY ENGINE...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" /> RUN RECOVERY ENGINE
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated Batch Progress Loader */}
            {batchLoading && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold text-[#38bdf8] flex items-center gap-2">
                    <Bot className="w-4 h-4 animate-spin" /> PROCESSING BATCH
                  </span>
                  <span>{loadingStep === 1 ? '25%' : loadingStep === 2 ? '50%' : loadingStep === 3 ? '75%' : '92%'}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0284c7] to-[#10b981] transition-all duration-300"
                    style={{ width: `${loadingStep * 25}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  {loadingStep === 1 && "Analyzing 50 failure transactions..."}
                  {loadingStep === 2 && "Diagnosing gateway root causes & churn risk scores..."}
                  {loadingStep === 3 && "Evaluating policy guardrails (Hard declines, Max retries, DND window)..."}
                  {loadingStep === 4 && "Executing recovery outreach & compiling audit trail..."}
                </div>
              </div>
            )}

            {/* Hero Result Banner — Emphasizing Recovered Money */}
            {batchResult && !batchLoading && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#061427] via-[#0a1e38] to-[#061427] border-2 border-[#0284c7]/60 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#38bdf8] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#38bdf8]" /> BATCH RECOVERY TELEMETRY RESULT
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                      Recovery Yield: {batchResult.metrics.recoveryYieldPercent}%
                    </span>
                  </div>

                  {/* Giant Money Highlight */}
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 tracking-tight font-display">
                      ₹{(batchResult.metrics.totalARRRecovered / 100000).toFixed(2)} Lakhs
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 font-sans">
                      recovered from <strong className="text-white">₹{(batchResult.metrics.totalARRAtRisk / 100000).toFixed(2)} Lakhs</strong> at risk across {batchResult.batchSize} transactions
                    </div>
                  </div>

                  {/* 4 Stat Blocks */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-center">
                      <div className="text-2xl font-black text-emerald-400">{batchResult.metrics.recoveredCount}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">RECOVERED</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 text-center">
                      <div className="text-2xl font-black text-rose-400">{batchResult.metrics.haltedCount}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">HALTED</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 text-center">
                      <div className="text-2xl font-black text-amber-400">{batchResult.metrics.deferredCount}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">DEFERRED</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-[#0284c7]/30 text-center">
                      <div className="text-2xl font-black text-[#38bdf8]">{batchResult.metrics.escalatedCount}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">ESCALATED</div>
                    </div>
                  </div>

                  {/* Recovery Yield Horizontal Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>Recovery Yield Visualization</span>
                      <span className="font-bold text-[#38bdf8]">{batchResult.metrics.recoveryYieldPercent}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#00d2ff] to-[#10b981]"
                        style={{ width: `${batchResult.metrics.recoveryYieldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Itemized Transactions Table */}
                <div className="rz-card overflow-hidden border border-slate-800">
                  <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Itemized Batch Transactions & Agent Execution Traces
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">Showing {batchResult.itemizedResults.length} Transactions</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Txn ID</th>
                          <th className="px-4 py-3">Customer & Plan</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Failure Reason</th>
                          <th className="px-4 py-3">Engine Status</th>
                          <th className="px-4 py-3 text-right">Execution Trace</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {batchResult.itemizedResults.map(item => (
                          <React.Fragment key={item.id}>
                            <tr className="hover:bg-slate-900/40 transition-colors font-sans">
                              <td className="px-4 py-3 font-mono font-bold text-[#38bdf8]">{item.id}</td>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-white">{item.customerName}</div>
                                <div className="text-[10px] text-slate-400">{item.plan}</div>
                              </td>
                              <td className="px-4 py-3 font-bold text-white">₹{item.amount.toLocaleString('en-IN')}</td>
                              <td className="px-4 py-3 text-slate-300">{item.failureCategory}</td>
                              <td className="px-4 py-3">
                                {item.status === 'RECOVERED' && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">RECOVERED</span>
                                )}
                                {item.status.includes('HALTED') && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">HALTED ({item.status.replace('HALTED_', '')})</span>
                                )}
                                {item.status.includes('DEFERRED') && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">DEFERRED (DND)</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => setExpandedItemAudit(expandedItemAudit === item.id ? null : item.id)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono flex items-center gap-1 ml-auto cursor-pointer"
                                >
                                  {expandedItemAudit === item.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  {expandedItemAudit === item.id ? "Hide Trace" : "View Agent Trace"}
                                </button>
                              </td>
                            </tr>

                            {/* Visual Execution Trace Sub-Row */}
                            {expandedItemAudit === item.id && (
                              <tr className="bg-slate-950 border-b border-slate-800">
                                <td colSpan="6" className="px-6 py-4 space-y-4">
                                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                                      <Bot className="w-4 h-4" /> Agent Execution Trace Pipeline
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-[11px]">
                                      {item.machineAuditTrail.map((stepObj) => (
                                        <div key={stepObj.step} className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                                          <div className="text-[10px] font-bold text-[#38bdf8]">0{stepObj.step} {stepObj.stage}</div>
                                          <div className="text-[10px] text-slate-300 font-sans leading-snug">{stepObj.detail}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* AI Decision Rationale */}
                                  <div className="p-3.5 rounded-xl bg-[#07172e] border border-[#0284c7]/40 text-xs font-sans space-y-1">
                                    <div className="font-bold text-[#38bdf8] flex items-center gap-1.5">
                                      <HelpCircle className="w-3.5 h-3.5" /> AI DECISION RATIONALE
                                    </div>
                                    <p className="text-slate-300 text-[11px]">
                                      {item.failureCategory.includes("Outage")
                                        ? "Bank gateway node degradation detected. Repeating card transaction has low recovery probability. Deferring retry & routing to 1-Tap UPI Intent provides higher conversion."
                                        : item.failureCategory.includes("Decline")
                                        ? "Soft decline detected (insufficient balance). Triggering gentle nudge with 5% instant clearance incentive (REV5OFF)."
                                        : "Hard decline or policy boundary reached. Halting automated attempts to prevent bank penalty fees."}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {!batchResult && !batchLoading && (
              <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900/40 rounded-xl border border-slate-800">
                <Layers className="w-10 h-10 text-[#38bdf8] mx-auto opacity-70" />
                <div className="font-bold text-white text-base font-display">Ready for Batch Recovery Execution</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click <strong>"RUN RECOVERY ENGINE"</strong> above to execute deterministic recovery across 50 transactions and view measured money recovered.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: SINGLE TRANSACTION CONSOLE */}
      {mode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Presets */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rz-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2 font-display">
                  <Cpu className="w-4 h-4 text-[#38bdf8]" /> Select Failure Scenario
                </span>
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {presetScenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(sc)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs flex items-center justify-between cursor-pointer ${
                      formData.failureReason === sc.reason
                        ? 'bg-[#0284c7]/20 border-[#0284c7] text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-100">{sc.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">₹{sc.amount.toLocaleString('en-IN')}</div>
                    </div>
                    {formData.failureReason === sc.reason && (
                      <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmitSingle} className="space-y-3 pt-3 border-t border-slate-800">
                {/* Language Copy Toggle & B2B Switch */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#38bdf8]" /> Language Copy
                    </label>
                    <select
                      value={formData.language}
                      onChange={e => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                    >
                      <option value="en">English Copy</option>
                      <option value="hinglish">Hinglish Copy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Type</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isB2B: !formData.isB2B })}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        formData.isB2B ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {formData.isB2B ? "B2B Net-30 Invoice" : "B2C Subscription"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Company</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subscription / Plan</label>
                  <input
                    type="text"
                    value={formData.plan}
                    onChange={e => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Raw Gateway Error Payload</label>
                  <input
                    type="text"
                    value={formData.rawErrorMessage}
                    onChange={e => setFormData({ ...formData, rawErrorMessage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-[#38bdf8] font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#00d2ff] to-[#10b981] text-slate-950 font-black text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <>
                      <Bot className="w-4 h-4 animate-spin text-slate-950" /> Evaluating Agent Pipeline...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" /> Dispatch Webhook Event
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Single Mode Output */}
          <div className="lg:col-span-7 space-y-4">
            {simulationResult ? (
              <div className="space-y-4">
                {/* B2B Receivable Specific Card if applicable */}
                {formData.isB2B && (
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-2 font-mono">
                    <div className="font-bold flex items-center justify-between text-amber-400">
                      <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> B2B RECEIVABLE DETAILS</span>
                      <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[10px]">NET 30</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>Company: <strong className="text-white">{formData.customerName}</strong></div>
                      <div>Invoice: <strong className="text-white">INV-2026-0842</strong></div>
                      <div>PO Reference: <strong className="text-white">{formData.poNumber || "PO-78142"}</strong></div>
                      <div>Age: <strong className="text-rose-400">34 DAYS OVERDUE</strong></div>
                    </div>
                  </div>
                )}

                <div className="rz-card p-5 space-y-4 border border-[#0284c7]/40">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <Bot className="w-4 h-4" /> Single Webhook Execution Output
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30 font-mono">
                      {simulationResult.campaignId}
                    </span>
                  </div>

                  {/* Policy Guardrails Status Box */}
                  <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    simulationResult.policyCheck.shouldHalt 
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                      : simulationResult.policyCheck.isDeferred
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                      : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> Configurable Policy Guardrail Check:
                    </div>
                    <div>{simulationResult.policyCheck.policyMessage}</div>
                  </div>

                  {/* Realistic WhatsApp Chat Preview */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between font-mono">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        WHATSAPP RECOVERY ({formData.language.toUpperCase()})
                      </span>
                      <span className="text-[10px] text-slate-400">Channel: WhatsApp | Stage 2 Nudge</span>
                    </div>

                    {/* WhatsApp Bubble Mock */}
                    <div className="p-4 rounded-xl bg-[#072417] border border-emerald-500/30 text-xs text-slate-100 space-y-3 font-sans shadow-lg">
                      <p className="whitespace-pre-line leading-relaxed">
                        {simulationResult.dunningContent.whatsappText.replace('{{RECOVERY_LINK}}', simulationResult.recoveryLink.url)}
                      </p>
                      <div className="pt-2 border-t border-emerald-500/20 flex justify-end">
                        <button
                          onClick={() => onNavigateToCustomerPortal(simulationResult.campaignId)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          COMPLETE PAYMENT <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recovery Link */}
                  {!simulationResult.policyCheck.shouldHalt && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900 border border-[#0284c7]/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                          <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                          Smart Recovery Link Ready
                        </span>
                        <button
                          onClick={() => handleCopyLink(simulationResult.recoveryLink.url)}
                          className="text-xs text-[#38bdf8] hover:text-white flex items-center gap-1 bg-[#0284c7]/10 px-2 py-1 rounded font-mono"
                        >
                          {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedLink ? "Copied!" : "Copy Link"}
                        </button>
                      </div>

                      <div className="pt-1 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => onNavigateToCustomerPortal(simulationResult.campaignId)}
                          className="flex-1 py-2.5 px-4 rounded-lg bg-[#38bdf8] hover:bg-[#0284c7] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          Open Customer Payment Screen
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rz-card p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
                <Bot className="w-10 h-10 text-[#38bdf8] opacity-80" />
                <div>
                  <h4 className="text-base font-bold text-white font-display">Single Webhook Sandbox Ready</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Select a failure scenario on the left or enter custom details and click <strong>"Dispatch Webhook Event"</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
