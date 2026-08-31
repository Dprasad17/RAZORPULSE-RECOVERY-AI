import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  Tag,
  Check,
  QrCode,
  Sparkles,
  Receipt,
  Download,
  Shield
} from 'lucide-react';

export default function CustomerPaymentPortal({ campaignId, campaigns = [], onPaymentSuccess, onBackToDashboard }) {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiProvider, setUpiProvider] = useState('gpay');
  const [showQR, setShowQR] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recoveredAmount, setRecoveredAmount] = useState(0);

  useEffect(() => {
    if (campaigns.length > 0) {
      const match = campaigns.find(c => c.id === campaignId || c.recoveryLinkId === campaignId) || campaigns[0];
      setSelectedCampaign(match);
      if (match) {
        setDiscountApplied(match.discountApplied && match.discountApplied.includes('REV5OFF'));
      }
    }
  }, [campaignId, campaigns]);

  if (!selectedCampaign) {
    return (
      <div className="rz-card p-12 text-center text-slate-400 space-y-4">
        <div>No active recovery campaign found.</div>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
        >
          Return to Command Hub
        </button>
      </div>
    );
  }

  const rawAmount = selectedCampaign.amount;
  const discountAmount = Math.round(rawAmount * 0.05);
  const finalAmount = discountApplied ? Math.round(rawAmount * 0.95) : rawAmount;

  const handlePayNow = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/recover-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          paymentMethodUsed: paymentMethod === 'upi' ? `UPI (${upiProvider.toUpperCase()})` : paymentMethod === 'card' ? 'Credit Card (Updated Token)' : 'NetBanking HDFC Node 2'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setRecoveredAmount(finalAmount);
        if (onPaymentSuccess) onPaymentSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Back Navigation */}
      <button
        onClick={onBackToDashboard}
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to RazorPulse Command Hub
      </button>

      {/* Main Split-Screen Checkout Window */}
      <div className="rz-card overflow-hidden border border-[#0284c7]/40 shadow-2xl bg-[#080e1a]">
        {/* Top Branding Banner */}
        <div className="bg-gradient-to-r from-[#070d19] via-[#0d1d3a] to-[#070d19] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0284c7] to-[#10b981] flex items-center justify-center font-black text-slate-950 text-sm">
              <Shield className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white flex items-center gap-1.5 font-display">
                RAZORPULSE DEMO CHECKOUT
                <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Protected payment simulation</div>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
            🔒 Secure Gateway Node
          </span>
        </div>

        {/* Content Area */}
        {success ? (
          <div className="p-12 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white font-display">Payment Recovered!</h3>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                Razorpay Payment ID: <span className="text-[#38bdf8]">pay_rec_{Math.floor(100000 + Math.random() * 900000)}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 text-slate-300 font-mono text-left">
              <div className="flex justify-between"><span className="text-slate-400">Customer:</span> <strong className="text-white">{selectedCampaign.customerName}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Subscription:</span> <strong className="text-white">{selectedCampaign.plan}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Method Used:</span> <strong className="text-[#38bdf8]">{paymentMethod === 'upi' ? `UPI (${upiProvider.toUpperCase()})` : 'Card Update Token'}</strong></div>
              <div className="flex justify-between pt-1 border-t border-slate-800"><span className="text-slate-400">Amount Settled:</span> <strong className="text-emerald-400 font-black text-sm">₹{recoveredAmount.toLocaleString('en-IN')}</strong></div>
            </div>

            <button
              onClick={onBackToDashboard}
              className="w-full py-3.5 rounded-xl bg-[#38bdf8] text-slate-950 font-black text-sm shadow-lg hover:brightness-110 cursor-pointer"
            >
              Return to Command Hub
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Left 5 Cols: Merchant Invoice Summary */}
            <div className="lg:col-span-5 p-6 space-y-6 bg-slate-950/60">
              <div>
                <div className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold">MERCHANT INVOICE</div>
                <h3 className="text-lg font-bold text-white mt-1 font-display">{selectedCampaign.plan}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Billed to: {selectedCampaign.customerName} ({selectedCampaign.email})</p>
              </div>

              {/* Itemized Cost Breakdown Table */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Subscription Renewal Fee</span>
                  <span className="text-white font-bold">₹{rawAmount.toLocaleString('en-IN')}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> AI Waiver (REV5OFF)</span>
                    <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 font-bold">Total Net Payable</span>
                  <span className="text-xl font-black text-[#38bdf8]">₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* AI Dunning Incentive Highlight */}
              {discountApplied && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> AI DUNNING INCENTIVE APPLIED
                  </div>
                  <p className="text-[11px] text-emerald-200/90 font-sans">
                    5% instant waiver applied to clear payment failure immediately.
                  </p>
                </div>
              )}

              <div className="text-[11px] text-slate-500 space-y-1 font-mono pt-2">
                <div className="flex items-center gap-1 text-slate-400">
                  <Lock className="w-3 h-3 text-[#38bdf8]" /> Protected payment simulation environment
                </div>
                <div>Authorized merchant node: AuraCloud SaaS</div>
              </div>
            </div>

            {/* Right 7 Cols: Interactive Payment Selector */}
            <div className="lg:col-span-7 p-6 space-y-6">
              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Select Recovery Payment Method
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'upi'
                        ? 'bg-[#0284c7]/20 border-[#0284c7] text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#38bdf8]" />
                    <span className="text-xs font-bold font-mono">1-Tap UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-[#0284c7]/20 border-[#0284c7] text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-bold font-mono">Card Update</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#0284c7]/20 border-[#0284c7] text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold font-mono">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* UPI App Selection Grid */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">Choose Preferred UPI App:</span>
                    <button
                      type="button"
                      onClick={() => setShowQR(!showQR)}
                      className="text-[11px] text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" /> {showQR ? "Hide QR" : "Show QR Code"}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { id: 'gpay', name: 'Google Pay', color: 'text-blue-400' },
                      { id: 'phonepe', name: 'PhonePe', color: 'text-purple-400' },
                      { id: 'paytm', name: 'Paytm', color: 'text-cyan-400' },
                      { id: 'bhim', name: 'BHIM UPI', color: 'text-emerald-400' }
                    ].map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiProvider(app.id)}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          upiProvider === app.id 
                            ? 'bg-[#0284c7] border-[#0284c7] text-white' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className={`font-mono text-[11px] ${app.color}`}>{app.name}</div>
                      </button>
                    ))}
                  </div>

                  {showQR && (
                    <div className="p-4 rounded-xl bg-white text-slate-950 flex flex-col items-center space-y-2 max-w-xs mx-auto">
                      <QrCode className="w-28 h-28 text-slate-900" />
                      <div className="text-[10px] font-bold">Scan with any UPI App to Pay ₹{finalAmount}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Form Mock */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="text-slate-300 font-bold">Enter Card Replacement Details:</div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8912"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                      defaultValue="4532 •••• •••• 8912"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                        defaultValue="08 / 28"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-[#38bdf8]"
                        defaultValue="•••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Bank Grid */}
              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="text-slate-300 font-bold">Select NetBanking Node:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Other Bank'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-[#0284c7] text-xs font-bold text-center cursor-pointer"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayNow}
                disabled={processing}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#00d2ff] to-[#10b981] text-slate-950 font-black text-sm shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Lock className="w-4 h-4 animate-spin text-slate-950" /> Authorizing Payment Gateway...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Pay ₹{finalAmount.toLocaleString('en-IN')} & Clear Account Suspension
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
