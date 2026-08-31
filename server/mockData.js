export const initialMerchantState = {
  merchantInfo: {
    name: "AuraCloud SaaS & E-Commerce",
    merchantId: "mid_razor_98241",
    tier: "Enterprise Merchant",
    currency: "INR",
    activeSubscriptions: 14200,
    monthlyARR: 4850000 // ₹48.5 Lakhs
  },
  metrics: {
    arrAtRisk: 684500, // ₹6.84 Lakhs
    arrRecovered: 492100, // ₹4.92 Lakhs
    recoverySuccessRate: 71.9, // 71.9%
    totalFailedPayments: 342,
    activeRecoveryCampaigns: 48,
    avgRecoveryTimeHours: 4.2
  },
  failureReasonsDistribution: [
    { category: "Soft Decline (Insufficient Funds / Limit)", percentage: 38, count: 130, color: "#3a86ff" },
    { category: "Bank Network Outage / Downtime", percentage: 26, count: 89, color: "#f59e0b" },
    { category: "Card Expired / Invalid Details", percentage: 18, count: 62, color: "#ec4899" },
    { category: "Razorpay Mandate Drop / Autopay Auth", percentage: 12, count: 41, color: "#8b5cf6" },
    { category: "OTP Timeout & Customer Abandonment", percentage: 6, count: 20, color: "#ef4444" }
  ],
  campaigns: [
    {
      id: "REC-89021",
      customerName: "Vikram Malhotra",
      email: "vikram.m@techcorp.in",
      phone: "+91 98765 43210",
      amount: 14999,
      plan: "Pro Scale Annual (SaaS)",
      failedAt: "2026-08-27T18:30:00Z",
      failureReason: "bank_outage",
      failureReasonText: "HDFC Bank NetBanking Gateway Timeout (HTTP 504)",
      riskScore: 84,
      status: "RECOVERED",
      channelUsed: "WhatsApp + UPI Intent Link",
      agentActionSummary: "Diagnosed bank outage. Paused immediate auto-retry. Triggered WhatsApp recovery with 1-click Razorpay UPI Intent link at 08:00 PM during bank uptime.",
      recoveredAt: "2026-08-27T20:15:00Z",
      discountApplied: "None (Outage Retry)",
      timeline: [
        { time: "18:30", event: "Razorpay Webhook payment.failed received (Err: BANK_GATEWAY_DOWN)" },
        { time: "18:31", event: "AI Diagnoser Agent flagged high-value subscription churn risk (Risk Score: 84/100)" },
        { time: "18:31", event: "AI Smart Scheduler queued retry for 20:00 after verifying HDFC node recovery" },
        { time: "20:00", event: "AI Conversational Agent dispatched WhatsApp interactive UPI payment link" },
        { time: "20:15", event: "Customer completed payment via Google Pay UPI (Payment ID: pay_P9812401)" }
      ]
    },
    {
      id: "REC-89022",
      customerName: "Ananya Sharma",
      email: "ananya.design@studio.com",
      phone: "+91 99887 76655",
      amount: 4999,
      plan: "Creator Suite Monthly",
      failedAt: "2026-08-27T19:10:00Z",
      failureReason: "insufficient_funds",
      failureReasonText: "Card Payment Declined: Insufficient Balance / Credit Limit",
      riskScore: 62,
      status: "IN_RECOVERY",
      channelUsed: "Email + WhatsApp Smart Offer",
      agentActionSummary: "Diagnosed soft decline. Scheduled gentle reminder + offered flexible payment method update (UPI / EMI option).",
      recoveredAt: null,
      discountApplied: "REV5OFF (5% Instant Waiver)",
      timeline: [
        { time: "19:10", event: "Razorpay Webhook subscription.halted received" },
        { time: "19:11", event: "AI Agent selected soft-nudge strategy with 5% discount incentive valid for 6 hrs" },
        { time: "19:12", event: "Email & WhatsApp dispatched with single-tap Razorpay recovery checkout link" }
      ]
    },
    {
      id: "REC-89023",
      customerName: "Rohan Varma",
      email: "rohan.v@growthx.co",
      phone: "+91 91234 56789",
      amount: 28500,
      plan: "Enterprise Add-on Seats",
      failedAt: "2026-08-27T20:00:00Z",
      failureReason: "card_expired",
      failureReasonText: "Visa Credit Card Expired (08/26)",
      riskScore: 78,
      status: "ACTION_REQUIRED",
      channelUsed: "In-App Banner + Priority Email",
      agentActionSummary: "Detected card expiry. AI generated direct credit card update modal link without requiring full re-authentication.",
      recoveredAt: null,
      discountApplied: "None",
      timeline: [
        { time: "20:00", event: "Razorpay Webhook invoice.payment_failed received (ERR_EXPIRED_CARD)" },
        { time: "20:01", event: "AI Card Updater Agent sent secure payment method update link" }
      ]
    },
    {
      id: "REC-89024",
      customerName: "Neha Kulkarni",
      email: "neha.k@fintech.io",
      phone: "+91 97654 32109",
      amount: 12000,
      plan: "API Usage Tier 2",
      failedAt: "2026-08-27T16:45:00Z",
      failureReason: "mandate_failed",
      failureReasonText: "E-Mandate Execution Failed: Customer Bank Auth Required",
      riskScore: 91,
      status: "RECOVERED",
      channelUsed: "WhatsApp AI Bot",
      agentActionSummary: "Mandate re-authorization required. Interactive WhatsApp Bot guided user to re-approve auto-debit in 2 taps.",
      recoveredAt: "2026-08-27T17:20:00Z",
      discountApplied: "None",
      timeline: [
        { time: "16:45", event: "Razorpay e-mandate transaction rejected by NPCI" },
        { time: "16:46", event: "WhatsApp AI Bot initiated mandate re-registration flow" },
        { time: "17:20", event: "Mandate successfully re-authorized via PhonePe Mandate Hub" }
      ]
    }
  ]
};
