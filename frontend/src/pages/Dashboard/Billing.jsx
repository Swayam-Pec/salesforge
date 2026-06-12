import React, { useEffect, useState } from "react";
import { billingService } from "@/services";
import { useUptoStyles, UptoPage, UptoHero, UptoSectionHeading, UptoButton, UptoBadge, UptoSpinner, UptoError, UptoCard } from "@/components/UI/UptoHooks";
import { Check, CreditCard, Sparkles, ShieldCheck, Zap, Building2 } from "lucide-react";
import { toast } from "sonner";

const PLANS = [
  { id: "FREE", name: "Free", icon: Sparkles, price: { monthly: 0, yearly: 0 }, blurb: "For solo founders exploring the platform.", features: ["Up to 100 leads", "1 team member", "Basic search tools", "Community support"] },
  { id: "STARTER", name: "Starter", icon: Zap, price: { monthly: 29, yearly: 290 }, recommended: true, blurb: "For small teams getting serious about lead generation.", features: ["Up to 1,000 leads", "5 team members", "All search tools", "API access", "Email support"] },
  { id: "PRO", name: "Pro", icon: ShieldCheck, price: { monthly: 99, yearly: 990 }, blurb: "For growing teams that need automation and integrations.", features: ["Up to 10,000 leads", "25 team members", "Webhooks", "Saved searches", "Priority support", "Custom domains"] },
  { id: "ENTERPRISE", name: "Enterprise", icon: Building2, price: { monthly: null, yearly: null }, blurb: "Unlimited everything with a dedicated success manager.", features: ["Unlimited leads", "Unlimited members", "SSO & SAML", "SLA", "Dedicated CSM", "On-prem option"] },
];

const Billing = () => {
  const s = useUptoStyles();
  const { darkMode } = s;
  const [sub, setSub] = useState(null);
  const [interval, setInterval] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setSub(await billingService.subscription()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const checkout = async (plan) => {
    setBusy(true);
    try {
      const result = await billingService.checkout({ plan, interval });
      if (result.contactSales) { toast.info("Our team will reach out to set up Enterprise."); return; }
      toast.success(`Subscribed to ${plan} (${interval})`);
      await load();
    } catch (e) { toast.error(e.message || "Checkout failed"); }
    finally { setBusy(false); }
  };

  const cancel = async () => {
    if (!confirm("Cancel your subscription? It will end at the period close.")) return;
    try { await billingService.cancel(); toast.success("Subscription canceled"); await load(); }
    catch (e) { toast.error(e.message); }
  };

  if (loading) return <UptoSpinner />;
  if (error) return <UptoError error={error} onRetry={load} />;

  return (
    <UptoPage>
      <UptoHero
        title="Billing & plans"
        subtitle="Manage your subscription and view your plan usage."
        darkMode={darkMode}
        actions={sub && (
          <div className="flex items-center gap-2">
            <UptoBadge tone="brand">Current: {sub.plan}</UptoBadge>
            {sub.cancelAtPeriodEnd && <UptoBadge tone="warning">Canceling</UptoBadge>}
          </div>
        )}
      />

      {sub && (
        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <UptoCard>
              <p className={`text-xs uppercase ${s.subtext}`}>Current plan</p>
              <p className={`text-2xl font-bold ${s.heading}`}>{sub.plan}</p>
              <UptoBadge tone={sub.status === "ACTIVE" ? "success" : "warning"}>{sub.status}</UptoBadge>
            </UptoCard>
            <UptoCard>
              <p className={`text-xs uppercase ${s.subtext}`}>Period ends</p>
              <p className={`text-2xl font-bold ${s.heading}`}>{sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "—"}</p>
            </UptoCard>
            <UptoCard>
              <p className={`text-xs uppercase ${s.subtext}`}>Status</p>
              <p className={`text-2xl font-bold ${s.heading}`}>{sub.cancelAtPeriodEnd ? "Pending" : "Active"}</p>
              {!sub.cancelAtPeriodEnd && sub.plan !== "FREE" && (
                <UptoButton variant="danger" onClick={cancel}>Cancel plan</UptoButton>
              )}
            </UptoCard>
          </div>
        </section>
      )}

      <section>
        <UptoSectionHeading label="Choose a plan" darkMode={darkMode} action={
          <div className={`inline-flex rounded-xl border p-1 text-sm ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"}`}>
            <button onClick={() => setInterval("monthly")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${interval === "monthly" ? "bg-[#00b5ad] text-white" : s.body}`}>Monthly</button>
            <button onClick={() => setInterval("yearly")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${interval === "yearly" ? "bg-[#00b5ad] text-white" : s.body}`}>Yearly <span className="ml-1 text-[10px] opacity-80">-17%</span></button>
          </div>
        } />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = sub?.plan === plan.id;
            const price = plan.price[interval];
            return (
              <div key={plan.id} className={`relative flex flex-col rounded-2xl border p-5 transition-colors ${s.card} ${plan.recommended ? `ring-2 ring-[#00b5ad]` : ""} ${isCurrent ? "ring-2 ring-emerald-500" : ""}`}>
                {plan.recommended && (
                  <span className="absolute -top-3 right-4 rounded-full bg-[#00b5ad] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Most popular</span>
                )}
                <div className="mb-3 flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${darkMode ? "bg-teal-900/30 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className={`text-lg font-semibold ${s.heading}`}>{plan.name}</h3>
                </div>
                <p className={`mb-3 text-sm ${s.subtext}`}>{plan.blurb}</p>
                <div className="mb-4">
                  {price === null ? (
                    <p className={`text-2xl font-bold ${s.heading}`}>Custom</p>
                  ) : (
                    <p className={`text-2xl font-bold ${s.heading}`}>
                      ${price}<span className={`ml-1 text-sm font-normal ${s.subtext}`}>/{interval === "monthly" ? "mo" : "yr"}</span>
                    </p>
                  )}
                </div>
                <ul className="mb-5 space-y-2 text-sm flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 ${s.body}`}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00b5ad]" /> {f}
                    </li>
                  ))}
                </ul>
                <UptoButton onClick={() => checkout(plan.id)} disabled={busy || isCurrent} variant={isCurrent ? "secondary" : "primary"}>
                  {isCurrent ? "Current plan" : plan.id === "ENTERPRISE" ? "Contact sales" : `Switch to ${plan.name}`}
                </UptoButton>
              </div>
            );
          })}
        </div>
      </section>
    </UptoPage>
  );
};

export default Billing;
