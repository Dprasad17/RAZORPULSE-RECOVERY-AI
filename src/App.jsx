import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import RecoverySimulator from './components/RecoverySimulator';
import CampaignsList from './components/CampaignsList';
import CustomerPaymentPortal from './components/CustomerPaymentPortal';
import ArchitectureDoc from './components/ArchitectureDoc';
import { 
  LayoutDashboard, 
  Zap, 
  ListOrdered, 
  CreditCard, 
  FileCode, 
  RefreshCw, 
  ShieldCheck, 
  RotateCcw,
  Activity,
  ChevronRight,
  Sparkles,
  Sliders,
  FolderKanban
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | simulator | campaigns | portal | doc
  const [overviewData, setOverviewData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [targetPortalCampaignId, setTargetPortalCampaignId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);

  // Fetch overview & campaigns telemetry
  const fetchData = async () => {
    try {
      const [ovRes, cmpRes] = await Promise.all([
        fetch('/api/overview'),
        fetch('/api/campaigns')
      ]);

      if (ovRes.ok && cmpRes.ok) {
        const ov = await ovRes.json();
        const cmp = await cmpRes.json();
        setOverviewData(ov);
        setCampaigns(cmp);
        setServerOnline(true);
      }
    } catch (err) {
      console.error("API error:", err);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000); // Live poll every 4s
    return () => clearInterval(interval);
  }, []);

  const handleResetSession = async () => {
    if (window.confirm("Reset demo state?\n\nThis restores the initial revenue-recovery merchant dataset.")) {
      try {
        await fetch('/api/reset', { method: 'POST' });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const navigateToPortal = (campaignId) => {
    setTargetPortalCampaignId(campaignId);
    setActiveTab('portal');
  };

  return (
    <div className="min-h-screen flex bg-[#050914] text-slate-100 selection:bg-[#0284c7]/30">
      {/* Vertical Left Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#070d19] border-r border-slate-800/80 sticky top-0 h-screen z-30 flex-shrink-0 justify-between p-4">
        <div className="space-y-6">
          {/* RazorPulse Brand Mark */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] via-[#00d2ff] to-[#10b981] flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-black" />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg tracking-tight font-display">RazorPulse AI</div>
              <div className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30 w-fit">
                Track 3: AI Recovery
              </div>
            </div>
          </div>

          {/* Navigation Tab Menu */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white shadow-lg shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" /> Command Hub
              </span>
              {activeTab === 'dashboard' && <ChevronRight className="w-3.5 h-3.5 text-sky-200" />}
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white shadow-lg shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-[#38bdf8]" /> Recovery Studio
              </span>
              {activeTab === 'simulator' && <ChevronRight className="w-3.5 h-3.5 text-sky-200" />}
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'campaigns'
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white shadow-lg shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4" /> Audit Directory
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                {campaigns.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('portal')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'portal'
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white shadow-lg shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" /> Checkout Portal
              </span>
              {activeTab === 'portal' && <ChevronRight className="w-3.5 h-3.5 text-sky-200" />}
            </button>

            <button
              onClick={() => setActiveTab('doc')}
              className={`w-full px-3.5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'doc'
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white shadow-lg shadow-sky-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-emerald-400" /> Evaluator Matrix
              </span>
              {activeTab === 'doc' && <ChevronRight className="w-3.5 h-3.5 text-sky-200" />}
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Status & Reset */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-sans">Engine Status:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ● DEMO LIVE
              </span>
            </div>
            <div className="text-[10px] text-slate-500">v2.4.0 • Autonomous Policy</div>
          </div>

          <button
            onClick={handleResetSession}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#070d19]/95 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0284c7] flex items-center justify-center text-slate-950 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-base font-display">RazorPulse AI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSession}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070d19] border-t border-slate-800 py-2.5 px-2 flex items-center justify-around text-[10px]">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'dashboard' ? 'text-[#38bdf8] font-bold' : 'text-slate-400'}`}>
            <LayoutDashboard className="w-4 h-4" /> Hub
          </button>
          <button onClick={() => setActiveTab('simulator')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'simulator' ? 'text-[#38bdf8] font-bold' : 'text-slate-400'}`}>
            <Zap className="w-4 h-4" /> Studio
          </button>
          <button onClick={() => setActiveTab('campaigns')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'campaigns' ? 'text-[#38bdf8] font-bold' : 'text-slate-400'}`}>
            <FolderKanban className="w-4 h-4" /> Directory
          </button>
          <button onClick={() => setActiveTab('portal')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'portal' ? 'text-[#38bdf8] font-bold' : 'text-slate-400'}`}>
            <CreditCard className="w-4 h-4" /> Checkout
          </button>
          <button onClick={() => setActiveTab('doc')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'doc' ? 'text-[#38bdf8] font-bold' : 'text-slate-400'}`}>
            <FileCode className="w-4 h-4" /> Matrix
          </button>
        </div>

        {/* Top Command Bar */}
        <div className="hidden lg:flex items-center justify-between h-14 px-8 border-b border-slate-800/80 bg-[#070d19]/60 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Razorpay Merchant Partner</span>
            <span className="text-slate-600">/</span>
            <span className="text-[#38bdf8] uppercase font-bold">
              {activeTab === 'dashboard' ? 'Command Hub' : activeTab === 'simulator' ? 'Recovery Studio' : activeTab === 'campaigns' ? 'Audit Directory' : activeTab === 'portal' ? 'Checkout Portal' : 'Evaluator Matrix'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-3 py-1.5 rounded-lg bg-[#0284c7]/20 hover:bg-[#0284c7]/30 text-[#38bdf8] border border-[#0284c7]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <Zap className="w-3.5 h-3.5" /> Open Recovery Studio
            </button>
          </div>
        </div>

        {/* Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-24 text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#38bdf8]" />
              <div className="text-sm font-semibold">Initializing RazorPulse Telemetry...</div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  data={overviewData}
                  onTabChange={setActiveTab}
                  onTriggerSimulator={() => setActiveTab('simulator')}
                />
              )}

              {activeTab === 'simulator' && (
                <RecoverySimulator
                  onSimulate={fetchData}
                  onNavigateToCustomerPortal={navigateToPortal}
                />
              )}

              {activeTab === 'campaigns' && (
                <CampaignsList
                  campaigns={campaigns}
                  onNavigateToCustomerPortal={navigateToPortal}
                />
              )}

              {activeTab === 'portal' && (
                <CustomerPaymentPortal
                  campaignId={targetPortalCampaignId || (campaigns[0] && campaigns[0].id)}
                  campaigns={campaigns}
                  onPaymentSuccess={fetchData}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'doc' && (
                <ArchitectureDoc />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
