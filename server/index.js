import express from 'express';
import cors from 'cors';
import { initialMerchantState } from './mockData.js';
import { RevShieldRecoveryEngine } from './recoveryEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store for the live demo session
let state = JSON.parse(JSON.stringify(initialMerchantState));
const recoveryEngine = new RevShieldRecoveryEngine();

// 0. Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'RevShield AI Revenue Recovery Engine',
    version: '2.4.0',
    description: 'Autonomous Multi-Agent Payment Recovery API for Razorpay Merchants',
    endpoints: {
      health: '/api/health',
      overview: '/api/overview',
      campaigns: '/api/campaigns',
      simulateFailure: 'POST /api/simulate-failure',
      recoverPayment: 'POST /api/recover-payment'
    },
    frontendUrl: 'http://localhost:3000'
  });
});

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'RevShield AI Revenue Recovery Engine',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Get Merchant Overview & Metrics
app.get('/api/overview', (req, res) => {
  res.json({
    merchantInfo: state.merchantInfo,
    metrics: state.metrics,
    failureReasonsDistribution: state.failureReasonsDistribution
  });
});

// 3. Get Active & Past Recovery Campaigns
app.get('/api/campaigns', (req, res) => {
  res.json(state.campaigns);
});

// 4. Simulate a Failed Payment Webhook (Interactive Judge Sandbox)
app.post('/api/simulate-failure', (req, res) => {
  try {
    const {
      customerName = "Priya Nambiar",
      email = "priya.nambiar@startup.in",
      phone = "+91 98112 23344",
      amount = 8999,
      plan = "Growth SaaS Annual",
      failureReason = "bank_outage",
      rawErrorMessage = "HDFC Bank NetBanking Gateway Timeout (HTTP 504)",
      paymentMethod = "card",
      retryCount = 1,
      language = "en",
      isB2B = false,
      poNumber = null
    } = req.body;

    const recoveryResult = recoveryEngine.processFailedPayment({
      customerId: `cust_${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      email,
      phone,
      amount: Number(amount),
      plan,
      failureCode: failureReason,
      rawErrorMessage,
      paymentMethod,
      retryCount: Number(retryCount),
      language,
      isB2B,
      poNumber
    });

    // Update in-memory metrics
    state.metrics.totalFailedPayments += 1;
    state.metrics.arrAtRisk += Number(amount);
    if (recoveryResult.status !== "HALTED_FRAUD_RISK" && recoveryResult.status !== "HALTED_MAX_RETRIES") {
      state.metrics.activeRecoveryCampaigns += 1;
    }

    // Add to campaigns list at top
    const newCampaign = {
      id: recoveryResult.campaignId,
      customerName,
      email,
      phone,
      amount: Number(amount),
      plan,
      failedAt: new Date().toISOString(),
      failureReason,
      failureReasonText: recoveryResult.diagnosis.rootCause,
      riskScore: recoveryResult.diagnosis.churnRiskScore,
      status: recoveryResult.status,
      channelUsed: recoveryResult.retryStrategy.primaryChannel,
      agentActionSummary: recoveryResult.diagnosis.recommendation,
      recoveryLink: recoveryResult.recoveryLink.url,
      recoveryLinkId: recoveryResult.recoveryLink.id,
      recoveredAt: null,
      discountApplied: recoveryResult.dunningContent.incentiveCode ? `${recoveryResult.dunningContent.incentiveCode} (5% Off)` : "None",
      policyCheck: recoveryResult.policyCheck,
      escalationMatrix: recoveryResult.escalationMatrix,
      machineAuditTrail: recoveryResult.machineAuditTrail,
      timeline: recoveryResult.executionLog.map(log => ({ time: log.time, event: log.text })),
      rawDiagnosis: recoveryResult.diagnosis,
      rawRetryStrategy: recoveryResult.retryStrategy,
      rawDunningContent: recoveryResult.dunningContent
    };

    state.campaigns.unshift(newCampaign);

    res.json({
      success: true,
      message: "Razorpay payment.failed webhook simulated successfully",
      campaign: newCampaign,
      fullEngineResult: recoveryResult
    });
  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4b. Execute Deterministic Batch Recovery Run (Fulfills "The Bar")
app.post('/api/simulate-batch', (req, res) => {
  try {
    const { batchSize = 50 } = req.body;
    const batchResult = recoveryEngine.processBatchPayments(Number(batchSize));

    // Update global telemetry metrics with batch results
    state.metrics.totalFailedPayments += batchResult.batchSize;
    state.metrics.arrAtRisk += batchResult.metrics.totalARRAtRisk;
    state.metrics.arrRecovered += batchResult.metrics.totalARRRecovered;
    state.metrics.recoverySuccessRate = Number(((state.metrics.arrRecovered / (state.metrics.arrRecovered + state.metrics.arrAtRisk)) * 100).toFixed(1));

    res.json({
      success: true,
      message: `Batch recovery of ${batchResult.batchSize} transactions executed deterministically`,
      batchResult
    });
  } catch (error) {
    console.error("Batch simulation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Complete Simulated Payment Recovery (Customer Recovery Portal)
app.post('/api/recover-payment', (req, res) => {
  const { campaignId, paymentMethodUsed = "UPI (Google Pay)" } = req.body;

  const campaignIndex = state.campaigns.findIndex(c => c.id === campaignId || c.recoveryLinkId === campaignId);

  if (campaignIndex !== -1) {
    const campaign = state.campaigns[campaignIndex];
    if (campaign.status !== "RECOVERED") {
      campaign.status = "RECOVERED";
      campaign.recoveredAt = new Date().toISOString();
      campaign.paymentMethodUsed = paymentMethodUsed;
      campaign.timeline.push({
        time: new Date().toLocaleTimeString(),
        event: `Payment successfully recovered via ${paymentMethodUsed}! Razorpay Payment ID: pay_rec_${Math.floor(100000 + Math.random() * 900000)}`
      });

      // Update metrics
      state.metrics.arrRecovered += campaign.amount;
      state.metrics.arrAtRisk = Math.max(0, state.metrics.arrAtRisk - campaign.amount);
      state.metrics.activeRecoveryCampaigns = Math.max(0, state.metrics.activeRecoveryCampaigns - 1);
      state.metrics.recoverySuccessRate = Number(((state.metrics.arrRecovered / (state.metrics.arrRecovered + state.metrics.arrAtRisk)) * 100).toFixed(1));
    }

    res.json({
      success: true,
      message: `Payment of ₹${campaign.amount} successfully recovered!`,
      campaign
    });
  } else {
    res.status(404).json({ success: false, message: "Campaign or recovery link not found" });
  }
});

// 6. Reset Session Demo Data
app.post('/api/reset', (req, res) => {
  state = JSON.parse(JSON.stringify(initialMerchantState));
  res.json({ success: true, message: "Demo environment state reset to initial values" });
});

app.listen(PORT, () => {
  console.log(`⚡ RevShield AI Express Backend running on http://localhost:${PORT}`);
});

export default app;
