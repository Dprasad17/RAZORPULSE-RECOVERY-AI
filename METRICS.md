# 📐 RazorPulse AI — Batch Telemetry & Recovery Yield Methodology

> **Track 3 Audit Documentation — How the 74.9% Recovery Yield & ₹5.12L Recouped Are Calculated**

---

## 🎯 Code Path & Computation Source

All recovery metrics are **dynamically computed** by the multi-agent backend engine in [`server/recoveryEngine.js`](file:///c:/RAZORPAY/server/recoveryEngine.js#L513-L625) inside `processBatchPayments(batchSize)` using a seeded PRNG (`seed = 123456789`).

> *Note: The 50-transaction batch runner uses deterministic PRNG simulation for instant 100% reproducible metrics, while single-transaction sandbox webhooks (`POST /api/simulate-failure`) invoke live Google Gemini GenAI LLM & Razorpay SDK APIs.*

### 1. Mathematical Formulas
$$\text{Total ARR at Risk} = \sum_{i=1}^{N} \text{Amount}_i$$

$$\text{Total ARR Recovered} = \sum_{i \in \text{Recovered}} \text{Amount}_i$$

$$\text{Recovery Yield Percentage} = \left( \frac{\text{Total ARR Recovered}}{\text{Total ARR at Risk}} \right) \times 100$$

---

## 📊 Category Distribution & Probabilistic Weighting

In a 50-transaction synthetic batch, failure categories are sampled according to real-world merchant failure distributions:

| Failure Category | Incident Code | Weight | Policy Guardrail Action | Recovery Rate |
| :--- | :--- | :--- | :--- | :--- |
| **Bank Network Outage** | `bank_outage` | 35% | Suppress retries during node outage (HTTP 504) → Route to 1-Tap UPI | 95% |
| **Insufficient Funds** | `insufficient_funds` | 30% | Apply 5% waiver code (`REV5OFF`) → Pay-day nudge | 85% |
| **Expired Card Details** | `expired_card` | 15% | Dispatch Razorpay Token Update Link | 70% |
| **Mandate Auth Drop** | `mandate_auth_failed` | 10% | Trigger 1-click UPI Autopay re-link | 80% |
| **B2B Receivables** | `b2b_overdue` | 5% | AP Tax Invoice Chaser + PO Reference | 90% |
| **Hard Decline / Fraud** | `hard_decline` | 5% | **HALTED BY POLICY** (0 attempts, 0 outreach) | **0% (Halted)** |

---

## 🛡 Policy Guardrail Stopping Rules Impact

Out of 50 batch transactions:
- **37 Transactions (74.0%)**: Successfully recovered via 1-Tap UPI & Dynamic Waivers.
- **8 Transactions (16.0%)**: **Halted by Policy** (`HALTED_FRAUD_RISK` / `HALTED_MAX_RETRIES`). Protecting merchant reputation & eliminating bank penalty fees.
- **5 Transactions (10.0%)**: **Deferred by Policy** (`DEFERRED_DND_HOURS`). Respecting TRAI 9 AM - 8 PM IST operating window.

---

## 🔍 Code Inspection Verification

To verify in code, open [`server/recoveryEngine.js`](file:///c:/RAZORPAY/server/recoveryEngine.js):
```javascript
const yieldRate = ((totalARRRecovered / totalARRAtRisk) * 100).toFixed(1);
```
Or execute via REST API:
```bash
curl -X POST http://localhost:5000/api/simulate-batch -H "Content-Type: application/json" -d '{"batchSize": 50}'
```
