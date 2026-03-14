import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, BarChart, Bar, Cell } from "recharts";

const fmt = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtD = (n) => "$" + fmt(n);
const fmtP = (n) => n.toFixed(2) + "%";

function Slider({ label, value, onChange, min, max, step, format = "dollar", sublabel, accentColor }) {
  const display = format === "dollar" ? fmtD(value)
    : format === "percent" ? fmtP(value)
    : format === "years" ? `${value} yrs`
    : format === "nights" ? `$${value}/night`
    : format === "pctInt" ? `${value}%`
    : `${value}`;
  const pct = ((value - min) / (max - min)) * 100;
  const clr = accentColor || "#D4A054";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontFamily: "'DM Sans',sans-serif", color: "#9CA3AF", letterSpacing: "0.02em" }}>{label}</span>
        <span style={{ fontSize: 14, fontFamily: "'Space Mono',monospace", color: clr, fontWeight: 700 }}>{display}</span>
      </div>
      {sublabel && <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>{sublabel}</div>}
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: "#1F2937" }}>
        <div style={{ position: "absolute", height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${clr}44, ${clr})`, width: `${pct}%`, transition: "width 0.1s" }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: -6, left: 0, width: "100%", height: 18, opacity: 0, cursor: "pointer" }}
        />
        <div style={{ position: "absolute", top: -3, left: `calc(${pct}% - 6px)`, width: 12, height: 12, borderRadius: "50%", background: clr, border: "2px solid #111827", transition: "left 0.1s", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function Toggle({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontFamily: "'DM Sans',sans-serif", color: "#9CA3AF", marginBottom: 6, letterSpacing: "0.02em" }}>{label}</div>
      <div style={{ display: "flex", gap: 0, borderRadius: 6, overflow: "hidden", border: "1px solid #374151" }}>
        {options.map(opt => (
          <button key={opt.value} onClick={() => onChange(opt.value)}
            style={{
              flex: 1, padding: "6px 12px", fontSize: 11, fontFamily: "'Space Mono',monospace",
              background: value === opt.value ? "#D4A054" : "#111827",
              color: value === opt.value ? "#111827" : "#6B7280",
              border: "none", cursor: "pointer", fontWeight: value === opt.value ? 700 : 400,
              transition: "all 0.2s"
            }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sublabel, variant, icon }) {
  const colors = {
    gold: { bg: "#D4A05410", border: "#D4A05440", text: "#D4A054" },
    green: { bg: "#10B98110", border: "#10B98140", text: "#10B981" },
    red: { bg: "#EF444410", border: "#EF444440", text: "#EF4444" },
    blue: { bg: "#3B82F610", border: "#3B82F640", text: "#3B82F6" },
    neutral: { bg: "#374151", border: "#4B5563", text: "#E5E7EB" },
  };
  const c = colors[variant] || colors.neutral;
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 2, minWidth: 0
    }}>
      <div style={{ fontSize: 10, fontFamily: "'DM Sans',sans-serif", color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {icon && <span style={{ marginRight: 4 }}>{icon}</span>}{label}
      </div>
      <div style={{ fontSize: 22, fontFamily: "'Space Mono',monospace", color: c.text, fontWeight: 700, letterSpacing: "-0.02em" }}>{value}</div>
      {sublabel && <div style={{ fontSize: 10, fontFamily: "'DM Sans',sans-serif", color: "#6B7280" }}>{sublabel}</div>}
    </div>
  );
}

function Section({ title, emoji, children, columns = 1 }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: "#E5E7EB",
        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14,
        display: "flex", alignItems: "center", gap: 8,
        borderBottom: "1px solid #1F2937", paddingBottom: 8
      }}>
        <span style={{ fontSize: 16 }}>{emoji}</span>{title}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: columns > 1 ? `repeat(${columns}, 1fr)` : "1fr",
        gap: 16
      }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight, indent }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "5px 0", borderBottom: "1px solid #1F293766",
      paddingLeft: indent ? 16 : 0
    }}>
      <span style={{ fontSize: 12, fontFamily: "'DM Sans',sans-serif", color: indent ? "#6B7280" : "#9CA3AF" }}>{label}</span>
      <span style={{
        fontSize: 13, fontFamily: "'Space Mono',monospace", fontWeight: highlight ? 700 : 400,
        color: highlight === "gold" ? "#D4A054" : highlight === "green" ? "#10B981" : highlight === "red" ? "#EF4444" : "#E5E7EB"
      }}>{value}</span>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1F2937", border: "1px solid #374151", borderRadius: 8, padding: "10px 14px",
      fontFamily: "'Space Mono',monospace", fontSize: 11
    }}>
      <div style={{ color: "#9CA3AF", marginBottom: 6 }}>Year {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {fmtD(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function MillsActCalculator() {
  // Property
  const [purchasePrice, setPurchasePrice] = useState(845000);
  const [marketValue, setMarketValue] = useState(870000);
  const [propTaxRate, setPropTaxRate] = useState(1.25);

  // Mills Act Cap Rate
  const [interestComp, setInterestComp] = useState(6.50);
  const [occupancyType, setOccupancyType] = useState("owner"); // owner = 4%, rental = 2%
  const [propTaxComp, setPropTaxComp] = useState(1.10);
  const [remainingLife, setRemainingLife] = useState(50);
  const [improvementRatio, setImprovementRatio] = useState(70);

  // Fair Market Rent (for Mills Act valuation)
  const [monthlyFairRent, setMonthlyFairRent] = useState(4200);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [monthlyOpEx, setMonthlyOpEx] = useState(500);

  // STR Revenue (actual income)
  const [nightlyRate, setNightlyRate] = useState(250);
  const [strOccupancy, setStrOccupancy] = useState(65);
  const [totRate, setTotRate] = useState(12.5);

  // Cost of Ownership
  const [monthlyMortgage, setMonthlyMortgage] = useState(5300);
  const [monthlyInsurance, setMonthlyInsurance] = useState(250);
  const [monthlyUtilities, setMonthlyUtilities] = useState(1000);
  const [monthlyLawn, setMonthlyLawn] = useState(200);
  const [monthlyPool, setMonthlyPool] = useState(200);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(300);

  // Tax bracket
  const [fedRate, setFedRate] = useState(35);
  const [stateRate, setStateRate] = useState(9.3);

  // View mode
  const [activeTab, setActiveTab] = useState("dashboard");

  const calcs = useMemo(() => {
    // Mills Act Valuation
    const grossAnnualIncome = monthlyFairRent * 12;
    const vacancyDeduction = grossAnnualIncome * (vacancyRate / 100);
    const effectiveGross = grossAnnualIncome - vacancyDeduction;
    const annualOpEx = monthlyOpEx * 12;
    const noi = effectiveGross - annualOpEx;

    const riskComp = occupancyType === "owner" ? 4.0 : 2.0;
    const amortComp = (1 / remainingLife) * (improvementRatio / 100) * 100;
    const totalCapRate = interestComp + riskComp + propTaxComp + amortComp;
    const restrictedValue = noi / (totalCapRate / 100);

    // Use lower of restricted vs assessed (Prop 13 base = purchase price for recent purchase)
    const assessedValue = purchasePrice; // Prop 13 base for recent purchase
    const enrolledValue = Math.min(restrictedValue, assessedValue, marketValue);

    // Tax calculations
    const standardAnnualTax = assessedValue * (propTaxRate / 100);
    const millsActAnnualTax = enrolledValue * (propTaxRate / 100);
    const annualSavings = standardAnnualTax - millsActAnnualTax;
    const savingsPct = standardAnnualTax > 0 ? (annualSavings / standardAnnualTax) * 100 : 0;

    // STR Revenue (actual income, separate from Mills Act valuation)
    const annualSTRGross = nightlyRate * (strOccupancy / 100) * 365;
    const annualTOT = annualSTRGross * (totRate / 100);
    const annualSTRNet = annualSTRGross - annualTOT;

    // Cost of Ownership
    const monthlyPropertyTax = millsActAnnualTax / 12;
    const totalMonthlyCost = monthlyMortgage + monthlyInsurance + monthlyUtilities +
      monthlyLawn + monthlyPool + monthlyMaintenance + monthlyPropertyTax;
    const totalAnnualCost = totalMonthlyCost * 12;

    // Without Mills Act cost
    const monthlyPropertyTaxStd = standardAnnualTax / 12;
    const totalMonthlyCostStd = monthlyMortgage + monthlyInsurance + monthlyUtilities +
      monthlyLawn + monthlyPool + monthlyMaintenance + monthlyPropertyTaxStd;
    const totalAnnualCostStd = totalMonthlyCostStd * 12;

    // Net analysis (with STR income)
    const annualNetWithMills = annualSTRNet - totalAnnualCost;
    const annualNetWithoutMills = annualSTRNet - totalAnnualCostStd;

    // Tax deduction value of property tax
    const combinedRate = (fedRate + stateRate) / 100;
    const taxDeductionWithMills = millsActAnnualTax * combinedRate;
    const taxDeductionWithout = standardAnnualTax * combinedRate;
    // Net tax benefit = savings on property tax bill - lost deduction value
    const netTaxBenefit = annualSavings - (taxDeductionWithout - taxDeductionWithMills);

    // STR income tax on net profit (simplified)
    const strTaxableIncome = Math.max(0, annualSTRNet - totalAnnualCost + millsActAnnualTax); // add back prop tax since it's deductible
    const strIncomeTax = strTaxableIncome * combinedRate;

    // Effective annual benefit = Mills Act savings + STR net - costs
    const totalAnnualBenefit = annualSTRNet + annualSavings;
    const monthlyNet = (totalAnnualBenefit - totalAnnualCost + (standardAnnualTax)) / 12;

    // Breakeven chart data (10 years, monthly resolution shown as yearly)
    const yearlyData = [];
    let cumulativeWithMills = 0;
    let cumulativeWithoutMills = 0;
    let cumulativeSavingsOnly = 0;
    for (let y = 1; y <= 10; y++) {
      cumulativeWithMills += annualNetWithMills;
      cumulativeWithoutMills += annualNetWithoutMills;
      cumulativeSavingsOnly += annualSavings;
      yearlyData.push({
        year: y,
        withMills: Math.round(cumulativeWithMills),
        withoutMills: Math.round(cumulativeWithoutMills),
        taxSavingsOnly: Math.round(cumulativeSavingsOnly),
      });
    }

    // Monthly breakeven data for first 3 years
    const monthlyData = [];
    let cumMonthly = 0;
    for (let m = 1; m <= 36; m++) {
      const monthIncome = annualSTRNet / 12;
      const monthSavings = annualSavings / 12;
      const monthCost = totalMonthlyCost;
      cumMonthly += (monthIncome + monthSavings - monthCost + (standardAnnualTax / 12));
      monthlyData.push({
        month: m,
        cumulative: Math.round(cumMonthly),
      });
    }

    // Rental viability
    const breakEvenNightlyRate = totalAnnualCost / (365 * (strOccupancy / 100) * (1 - totRate / 100));
    const cashOnCashReturn = annualNetWithMills > 0
      ? (annualNetWithMills / (purchasePrice * 0.2)) * 100 : 0;

    // Annual comparison bars
    const comparisonData = [
      { name: "STR Revenue", withMills: Math.round(annualSTRNet), withoutMills: Math.round(annualSTRNet) },
      { name: "Tax Savings", withMills: Math.round(annualSavings), withoutMills: 0 },
      { name: "Total Costs", withMills: -Math.round(totalAnnualCost), withoutMills: -Math.round(totalAnnualCostStd) },
      { name: "Net Position", withMills: Math.round(annualNetWithMills + annualSavings), withoutMills: Math.round(annualNetWithoutMills) },
    ];

    return {
      grossAnnualIncome, vacancyDeduction, effectiveGross, annualOpEx, noi,
      riskComp, amortComp, totalCapRate, restrictedValue, enrolledValue,
      assessedValue, standardAnnualTax, millsActAnnualTax, annualSavings, savingsPct,
      annualSTRGross, annualTOT, annualSTRNet,
      monthlyPropertyTax, totalMonthlyCost, totalAnnualCost,
      totalMonthlyCostStd, totalAnnualCostStd,
      annualNetWithMills, annualNetWithoutMills,
      combinedRate, taxDeductionWithMills, netTaxBenefit,
      totalAnnualBenefit, monthlyNet,
      yearlyData, monthlyData, comparisonData,
      breakEvenNightlyRate, cashOnCashReturn,
    };
  }, [purchasePrice, marketValue, propTaxRate, interestComp, occupancyType, propTaxComp,
    remainingLife, improvementRatio, monthlyFairRent, vacancyRate, monthlyOpEx,
    nightlyRate, strOccupancy, totRate, monthlyMortgage, monthlyInsurance,
    monthlyUtilities, monthlyLawn, monthlyPool, monthlyMaintenance, fedRate, stateRate]);

  const isViable = calcs.annualNetWithMills + calcs.annualSavings > 0;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "millsact", label: "Mills Act", icon: "§" },
    { id: "str", label: "STR Revenue", icon: "⌂" },
    { id: "costs", label: "Costs", icon: "⚙" },
    { id: "analysis", label: "Analysis", icon: "◉" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif", background: "#0B0F19", color: "#E5E7EB",
      minHeight: "100vh", padding: 0
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #111827 0%, #1a1a2e 100%)",
        borderBottom: "1px solid #D4A05440", padding: "20px 24px 16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #D4A054, #B8860B)", fontSize: 18, fontWeight: 700,
            fontFamily: "'Space Mono',monospace", color: "#111827"
          }}>S</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "#E5E7EB" }}>
              Mills Act Tax Calculator
            </div>
            <div style={{ fontSize: 11, color: "#D4A054", fontFamily: "'Space Mono',monospace" }}>
              STELLA × CA Rev & Tax Code §439-439.4
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#6B7280", marginTop: 8, fontFamily: "'DM Sans',sans-serif" }}>
          Income capitalization method · 2026 lien date · SBE LTA 2025/030 rates · Palm Springs defaults
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginTop: 14 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 14px", fontSize: 11, fontFamily: "'Space Mono',monospace",
                background: activeTab === tab.id ? "#D4A05420" : "transparent",
                color: activeTab === tab.id ? "#D4A054" : "#6B7280",
                border: activeTab === tab.id ? "1px solid #D4A05440" : "1px solid transparent",
                borderBottom: "none", borderRadius: "6px 6px 0 0", cursor: "pointer",
                transition: "all 0.2s", fontWeight: activeTab === tab.id ? 700 : 400
              }}>
              <span style={{ marginRight: 4 }}>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ─── DASHBOARD TAB ─── */}
        {activeTab === "dashboard" && (
          <>
            {/* Key Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
              <StatCard label="Annual Tax Savings" value={fmtD(calcs.annualSavings)} sublabel={`${calcs.savingsPct.toFixed(0)}% reduction`} variant="gold" icon="§" />
              <StatCard label="Mills Act Tax" value={fmtD(calcs.millsActAnnualTax)} sublabel={`was ${fmtD(calcs.standardAnnualTax)}`} variant="green" icon="⊘" />
              <StatCard label="Restricted Value" value={fmtD(calcs.enrolledValue)} sublabel={`vs ${fmtD(calcs.assessedValue)} assessed`} variant="blue" icon="▽" />
              <StatCard label="STR Net Revenue" value={fmtD(calcs.annualSTRNet)} sublabel={`${fmtD(calcs.annualSTRGross)} gross - TOT`} variant="neutral" icon="⌂" />
              <StatCard label="Annual Net Position" value={fmtD(calcs.annualNetWithMills + calcs.annualSavings)}
                sublabel={isViable ? "Rental is viable" : "Operating at a loss"}
                variant={isViable ? "green" : "red"} icon={isViable ? "✓" : "✕"} />
              <StatCard label="Break-Even Rate" value={`$${calcs.breakEvenNightlyRate.toFixed(0)}/nt`}
                sublabel={`at ${strOccupancy}% occupancy`} variant="neutral" icon="⊙" />
            </div>

            {/* 10-Year Projection Chart */}
            <div style={{
              background: "#111827", borderRadius: 12, border: "1px solid #1F2937",
              padding: "20px 20px 12px", marginBottom: 24
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E5E7EB", marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                10-Year Cumulative Position
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 16 }}>
                STR net income + Mills Act savings − total cost of ownership
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={calcs.yearlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradMills" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradNoMills" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4A054" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#D4A054" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="year" tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "Space Mono" }}
                    tickFormatter={v => `Y${v}`} stroke="#374151" />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "Space Mono" }}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} stroke="#374151" />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="#4B5563" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="withMills" name="With Mills Act" stroke="#10B981" fill="url(#gradMills)" strokeWidth={2} />
                  <Area type="monotone" dataKey="withoutMills" name="Without Mills Act" stroke="#EF4444" fill="url(#gradNoMills)" strokeWidth={2} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="taxSavingsOnly" name="Tax Savings Only" stroke="#D4A054" fill="url(#gradSavings)" strokeWidth={1.5} strokeDasharray="2 2" />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Space Mono", color: "#9CA3AF" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Adjust Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937" }}>
                <Slider label="Nightly Rate" value={nightlyRate} onChange={setNightlyRate} min={100} max={600} step={10} format="nights" />
                <Slider label="STR Occupancy" value={strOccupancy} onChange={setStrOccupancy} min={30} max={95} step={1} format="pctInt" accentColor="#3B82F6" />
              </div>
              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937" }}>
                <Slider label="Fair Market Rent" value={monthlyFairRent} onChange={setMonthlyFairRent} min={1500} max={8000} step={100} format="dollar" accentColor="#10B981" />
                <Slider label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} min={200000} max={2000000} step={5000} />
              </div>
              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937" }}>
                <Slider label="Federal Tax Rate" value={fedRate} onChange={setFedRate} min={10} max={37} step={1} format="pctInt" accentColor="#8B5CF6" />
                <Slider label="CA State Rate" value={stateRate} onChange={setStateRate} min={0} max={13.3} step={0.1} format="percent" accentColor="#8B5CF6" />
              </div>
            </div>
          </>
        )}

        {/* ─── MILLS ACT TAB ─── */}
        {activeTab === "millsact" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <Section title="Property" emoji="⌂">
                <div>
                  <Slider label="Purchase Price (Prop 13 Base)" value={purchasePrice} onChange={setPurchasePrice}
                    min={200000} max={2000000} step={5000} sublabel="Assessed value for recent purchase" />
                  <Slider label="Current Market Value" value={marketValue} onChange={setMarketValue}
                    min={200000} max={2000000} step={5000} />
                  <Slider label="Effective Property Tax Rate" value={propTaxRate} onChange={setPropTaxRate}
                    min={1.0} max={1.5} step={0.01} format="percent"
                    sublabel="Palm Springs typical ~1.25% (base + bonds)" />
                </div>
              </Section>

              <Section title="Fair Market Rent (Mills Act Valuation)" emoji="§">
                <div>
                  <Slider label="Monthly Fair Market Rent" value={monthlyFairRent} onChange={setMonthlyFairRent}
                    min={1500} max={8000} step={100} accentColor="#10B981"
                    sublabel="What the assessor determines as achievable LTR — NOT your STR revenue" />
                  <Slider label="Vacancy & Collection Loss" value={vacancyRate} onChange={setVacancyRate}
                    min={0} max={15} step={1} format="pctInt" accentColor="#10B981" />
                  <Slider label="Monthly Operating Expenses" value={monthlyOpEx} onChange={setMonthlyOpEx}
                    min={100} max={1500} step={50} accentColor="#10B981"
                    sublabel="Maintenance, insurance, management — excludes debt, depreciation, prop tax" />
                </div>
              </Section>
            </div>

            <div>
              <Section title="Capitalization Rate Components" emoji="⚡">
                <div>
                  <Slider label="Interest Component (SBE LTA 2025/030)" value={interestComp} onChange={setInterestComp}
                    min={2.5} max={8.0} step={0.25} format="percent"
                    sublabel="2026 lien date = 6.50% · Based on Freddie Mac average" />
                  <Toggle label="Risk Component (RTC §439.2)" value={occupancyType}
                    onChange={setOccupancyType}
                    options={[
                      { value: "owner", label: "Owner-Occupied (4%)" },
                      { value: "rental", label: "Rental (2%)" }
                    ]} />
                  <Slider label="Property Tax Component" value={propTaxComp} onChange={setPropTaxComp}
                    min={0.8} max={1.5} step={0.05} format="percent"
                    sublabel="Ad valorem rate for your tax rate area" />
                  <Slider label="Remaining Economic Life" value={remainingLife} onChange={setRemainingLife}
                    min={20} max={80} step={5} format="years"
                    sublabel="Your Wexler home ~50 yrs remaining" />
                  <Slider label="Improvement-to-Total Ratio" value={improvementRatio} onChange={setImprovementRatio}
                    min={40} max={90} step={5} format="pctInt"
                    sublabel="% of value in improvements vs. land" />
                </div>
              </Section>

              {/* Computed Results */}
              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #D4A05430" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A054", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ◈ Income Capitalization Worksheet
                </div>
                <InfoRow label="Gross Annual Income" value={fmtD(calcs.grossAnnualIncome)} />
                <InfoRow label={`Less Vacancy (${vacancyRate}%)`} value={`(${fmtD(calcs.vacancyDeduction)})`} indent />
                <InfoRow label="Less Operating Expenses" value={`(${fmtD(calcs.annualOpEx)})`} indent />
                <InfoRow label="Net Operating Income" value={fmtD(calcs.noi)} highlight="gold" />
                <div style={{ height: 8 }} />
                <InfoRow label="Interest Component" value={fmtP(interestComp)} indent />
                <InfoRow label="Risk Component" value={fmtP(calcs.riskComp)} indent />
                <InfoRow label="Property Tax Component" value={fmtP(propTaxComp)} indent />
                <InfoRow label={`Amortization (1/${remainingLife} × ${improvementRatio}%)`} value={fmtP(calcs.amortComp)} indent />
                <InfoRow label="Total Capitalization Rate" value={fmtP(calcs.totalCapRate)} highlight="gold" />
                <div style={{ height: 8 }} />
                <InfoRow label="Restricted Value (NOI ÷ Cap Rate)" value={fmtD(calcs.restrictedValue)} highlight="blue" />
                <InfoRow label="Prop 13 Assessed Value" value={fmtD(calcs.assessedValue)} />
                <InfoRow label="Enrolled Value (lower of)" value={fmtD(calcs.enrolledValue)} highlight="green" />
                <div style={{ height: 12 }} />
                <div style={{ background: "#D4A05410", borderRadius: 6, padding: 10, border: "1px solid #D4A05430" }}>
                  <InfoRow label="Standard Annual Property Tax" value={fmtD(calcs.standardAnnualTax)} />
                  <InfoRow label="Mills Act Annual Property Tax" value={fmtD(calcs.millsActAnnualTax)} highlight="green" />
                  <InfoRow label={`Annual Savings (${calcs.savingsPct.toFixed(0)}%)`} value={fmtD(calcs.annualSavings)} highlight="gold" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── STR REVENUE TAB ─── */}
        {activeTab === "str" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <Section title="Short-Term Rental Revenue" emoji="⌂">
                <div>
                  <Slider label="Nightly Rate" value={nightlyRate} onChange={setNightlyRate}
                    min={100} max={600} step={10} format="nights" accentColor="#3B82F6"
                    sublabel="Average across peak + off-peak seasons" />
                  <Slider label="Annual Occupancy Rate" value={strOccupancy} onChange={setStrOccupancy}
                    min={30} max={95} step={1} format="pctInt" accentColor="#3B82F6"
                    sublabel="PS avg ~55-70% · Desert season drives peaks" />
                  <Slider label="TOT + TBID Rate" value={totRate} onChange={setTotRate}
                    min={10} max={15} step={0.5} format="percent" accentColor="#3B82F6"
                    sublabel="Palm Springs: 11.5% TOT + 1% TBID = 12.5%" />
                </div>
              </Section>

              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #3B82F630", marginTop: 16 }}>
                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 8, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
                  <strong style={{ color: "#3B82F6" }}>⚡ SOUND vs SASSY NOTE:</strong> The Mills Act valuation
                  uses your long-term fair market rent ({fmtD(monthlyFairRent)}/mo) to determine restricted value.
                  Your actual STR revenue ({fmtD(calcs.annualSTRGross)}/yr gross) is a completely separate number
                  that drives profitability. The assessor doesn't care what you charge per night — they care what
                  a 12-month tenant would pay.
                </div>
              </div>
            </div>

            <div>
              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ⌂ STR Revenue Breakdown
                </div>
                <InfoRow label="Rental Nights / Year" value={`${Math.round(365 * strOccupancy / 100)} nights`} />
                <InfoRow label="Gross Annual Revenue" value={fmtD(calcs.annualSTRGross)} highlight="blue" />
                <InfoRow label={`Less TOT + TBID (${totRate}%)`} value={`(${fmtD(calcs.annualTOT)})`} indent />
                <InfoRow label="Net STR Revenue" value={fmtD(calcs.annualSTRNet)} highlight="green" />
                <div style={{ height: 12 }} />
                <InfoRow label="Monthly Net STR" value={fmtD(calcs.annualSTRNet / 12)} />
                <InfoRow label="Effective Per-Night (after TOT)" value={`$${(calcs.annualSTRNet / (365 * strOccupancy / 100)).toFixed(0)}`} />
                <div style={{ height: 12 }} />
                <div style={{ background: "#3B82F610", borderRadius: 6, padding: 10, border: "1px solid #3B82F630" }}>
                  <InfoRow label="Break-Even Nightly Rate" value={`$${calcs.breakEvenNightlyRate.toFixed(0)}/night`} highlight="blue" />
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>
                    Minimum rate at {strOccupancy}% occupancy to cover all costs (with Mills Act)
                  </div>
                </div>
              </div>

              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937", marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Seasonal Sensitivity
                </div>
                <div style={{ fontSize: 10, color: "#6B7280", lineHeight: 1.6 }}>
                  Palm Springs STR is heavily seasonal. Peak season (Jan–Apr) can yield $350–500/night at 80%+ occupancy.
                  Summer (Jun–Sep) drops to $150–200/night at 30–40%. Your annual blended rate of ${nightlyRate}/night
                  at {strOccupancy}% assumes this mix. Adjust sliders to model pessimistic/optimistic scenarios.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── COSTS TAB ─── */}
        {activeTab === "costs" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <Section title="Fixed Monthly Costs" emoji="⚙">
                <div>
                  <Slider label="Monthly Mortgage (P&I + PMI)" value={monthlyMortgage} onChange={setMonthlyMortgage}
                    min={0} max={10000} step={50}
                    sublabel="$750K @ 6.625% 30yr fixed via Loan Titan" />
                  <Slider label="Monthly Insurance" value={monthlyInsurance} onChange={setMonthlyInsurance}
                    min={100} max={800} step={25} />
                </div>
              </Section>

              <Section title="Operating Expenses" emoji="⚡">
                <div>
                  <Slider label="Utilities (Electric/Gas/Water/Trash)" value={monthlyUtilities} onChange={setMonthlyUtilities}
                    min={200} max={2000} step={50} accentColor="#10B981"
                    sublabel="Desert AC drives summer electric costs" />
                  <Slider label="Lawn / Landscaping" value={monthlyLawn} onChange={setMonthlyLawn}
                    min={0} max={500} step={25} accentColor="#10B981" />
                  <Slider label="Pool Maintenance" value={monthlyPool} onChange={setMonthlyPool}
                    min={0} max={500} step={25} accentColor="#10B981" />
                  <Slider label="Maintenance Reserve" value={monthlyMaintenance} onChange={setMonthlyMaintenance}
                    min={0} max={1000} step={50} accentColor="#10B981"
                    sublabel="General upkeep, repairs, turnover costs" />
                </div>
              </Section>
            </div>

            <div>
              <Section title="Tax Bracket" emoji="⊘">
                <div>
                  <Slider label="Federal Marginal Rate" value={fedRate} onChange={setFedRate}
                    min={10} max={37} step={1} format="pctInt" accentColor="#8B5CF6"
                    sublabel="35% at $223K W2 + STR income (MFJ)" />
                  <Slider label="CA State Marginal Rate" value={stateRate} onChange={setStateRate}
                    min={0} max={13.3} step={0.1} format="percent" accentColor="#8B5CF6"
                    sublabel="9.3% bracket for your income level" />
                </div>
              </Section>

              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#E5E7EB", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ⚙ Total Cost of Ownership
                </div>
                <InfoRow label="Mortgage" value={fmtD(monthlyMortgage)} />
                <InfoRow label="Property Tax (with Mills Act)" value={fmtD(calcs.monthlyPropertyTax)} indent />
                <InfoRow label="Insurance" value={fmtD(monthlyInsurance)} indent />
                <InfoRow label="Utilities" value={fmtD(monthlyUtilities)} indent />
                <InfoRow label="Lawn" value={fmtD(monthlyLawn)} indent />
                <InfoRow label="Pool" value={fmtD(monthlyPool)} indent />
                <InfoRow label="Maintenance Reserve" value={fmtD(monthlyMaintenance)} indent />
                <div style={{ height: 8 }} />
                <InfoRow label="Total Monthly Cost" value={fmtD(calcs.totalMonthlyCost)} highlight="red" />
                <InfoRow label="Total Annual Cost" value={fmtD(calcs.totalAnnualCost)} highlight="red" />
                <div style={{ height: 12 }} />
                <div style={{ background: "#10B98110", borderRadius: 6, padding: 10, border: "1px solid #10B98130" }}>
                  <InfoRow label="Without Mills Act (monthly)" value={fmtD(calcs.totalMonthlyCostStd)} />
                  <InfoRow label="Mills Act Monthly Savings" value={fmtD((calcs.totalMonthlyCostStd * 12 - calcs.totalAnnualCost) / 12)} highlight="green" />
                </div>
              </div>

              <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #8B5CF630", marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8B5CF6", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Tax Deduction Impact
                </div>
                <InfoRow label={`Combined Marginal Rate`} value={fmtP(fedRate + stateRate)} />
                <InfoRow label="Prop Tax Deduction (with Mills)" value={fmtD(calcs.taxDeductionWithMills)} indent />
                <InfoRow label="Net Tax Benefit of Mills Act" value={fmtD(calcs.netTaxBenefit)} highlight="green" />
                <div style={{ fontSize: 10, color: "#6B7280", marginTop: 6 }}>
                  Lower property tax = less to deduct, but the direct savings far outweigh the lost deduction.
                  Net benefit accounts for both.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── ANALYSIS TAB ─── */}
        {activeTab === "analysis" && (
          <>
            {/* Viability Banner */}
            <div style={{
              background: isViable ? "#10B98110" : "#EF444410",
              border: `1px solid ${isViable ? "#10B98140" : "#EF444440"}`,
              borderRadius: 10, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 16
            }}>
              <div style={{
                fontSize: 32, width: 56, height: 56, borderRadius: 12, display: "flex",
                alignItems: "center", justifyContent: "center",
                background: isViable ? "#10B98120" : "#EF444420"
              }}>
                {isViable ? "✓" : "✕"}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: isViable ? "#10B981" : "#EF4444" }}>
                  {isViable ? "STR is Viable with Mills Act" : "STR is Not Viable at Current Settings"}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                  Annual net position: {fmtD(calcs.annualNetWithMills + calcs.annualSavings)} ·
                  Break-even nightly rate: ${calcs.breakEvenNightlyRate.toFixed(0)} ·
                  At {fedRate + stateRate}% combined marginal rate
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                {/* Sound vs Sassy */}
                <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A054", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Sound vs Sassy Analysis
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ background: "#10B98108", border: "1px solid #10B98120", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", marginBottom: 8, fontFamily: "'Space Mono',monospace" }}>
                        🔒 SOUND
                      </div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", lineHeight: 1.6 }}>
                        Owner-occupied with 4% risk component. Apply for Mills Act 2027.
                        Use Junior Permit or 29+ day rentals in interim.
                        Report all income. Maintain REPS documentation.
                        Property tax savings: <strong style={{ color: "#10B981" }}>{fmtD(occupancyType === "owner" ? calcs.annualSavings : calcs.annualSavings * 1.17)}/yr</strong>
                      </div>
                    </div>
                    <div style={{ background: "#D4A05408", border: "1px solid #D4A05420", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A054", marginBottom: 8, fontFamily: "'Space Mono',monospace" }}>
                        💅 SASSY
                      </div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", lineHeight: 1.6 }}>
                        Classify as owner-occupied while running STR. The SBE hasn't defined when
                        part-time STR loses owner status. No case law.
                        Risk: reclassification to 2% risk = ~17% less savings.
                        Reward: keep the extra <strong style={{ color: "#D4A054" }}>{fmtD(Math.abs(calcs.annualSavings - calcs.annualSavings * (occupancyType === "owner" ? 1 : 0.83)))}/yr</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annual P&L */}
                <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#E5E7EB", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Annual P&L Statement
                  </div>
                  <InfoRow label="STR Gross Revenue" value={fmtD(calcs.annualSTRGross)} />
                  <InfoRow label={`TOT + TBID (${totRate}%)`} value={`(${fmtD(calcs.annualTOT)})`} indent />
                  <InfoRow label="STR Net Revenue" value={fmtD(calcs.annualSTRNet)} highlight="green" />
                  <InfoRow label="Mills Act Tax Savings" value={fmtD(calcs.annualSavings)} highlight="gold" />
                  <div style={{ height: 6, borderBottom: "2px solid #374151" }} />
                  <InfoRow label="Total Annual Income + Savings" value={fmtD(calcs.annualSTRNet + calcs.annualSavings)} highlight="green" />
                  <div style={{ height: 8 }} />
                  <InfoRow label="Annual Cost of Ownership" value={`(${fmtD(calcs.totalAnnualCost)})`} highlight="red" />
                  <div style={{ height: 6, borderBottom: "2px solid #374151" }} />
                  <InfoRow label="NET ANNUAL POSITION"
                    value={fmtD(calcs.annualNetWithMills + calcs.annualSavings)}
                    highlight={calcs.annualNetWithMills + calcs.annualSavings >= 0 ? "green" : "red"} />
                  <div style={{ height: 8 }} />
                  <InfoRow label="Without Mills Act comparison" value={fmtD(calcs.annualNetWithoutMills)} />
                  <InfoRow label="Mills Act Net Advantage" value={fmtD(calcs.annualSavings)} highlight="gold" />
                </div>
              </div>

              <div>
                {/* Comparison Chart */}
                <div style={{
                  background: "#111827", borderRadius: 10, border: "1px solid #1F2937",
                  padding: "16px 16px 8px", marginBottom: 16
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#E5E7EB", marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Annual With vs Without Mills Act
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={calcs.comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 9, fontFamily: "Space Mono" }} stroke="#374151" />
                      <YAxis tick={{ fill: "#6B7280", fontSize: 9, fontFamily: "Space Mono" }}
                        tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} stroke="#374151" />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={0} stroke="#4B5563" />
                      <Bar dataKey="withMills" name="With Mills Act" fill="#10B981" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="withoutMills" name="Without Mills Act" fill="#EF4444" radius={[3, 3, 0, 0]} opacity={0.6} />
                      <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Space Mono" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Metrics */}
                <div style={{ background: "#111827", borderRadius: 10, padding: 16, border: "1px solid #1F2937" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#E5E7EB", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Key Metrics
                  </div>
                  <InfoRow label="Monthly Net Cash Flow" value={fmtD((calcs.annualNetWithMills + calcs.annualSavings) / 12)}
                    highlight={(calcs.annualNetWithMills + calcs.annualSavings) >= 0 ? "green" : "red"} />
                  <InfoRow label="Break-Even Nightly Rate" value={`$${calcs.breakEvenNightlyRate.toFixed(0)}/night`} highlight="blue" />
                  <InfoRow label="10-Year Cumulative (with Mills)" value={fmtD(calcs.yearlyData[9]?.withMills || 0)}
                    highlight={calcs.yearlyData[9]?.withMills >= 0 ? "green" : "red"} />
                  <InfoRow label="10-Year Cumulative (without)" value={fmtD(calcs.yearlyData[9]?.withoutMills || 0)} />
                  <InfoRow label="10-Year Mills Act Savings Total" value={fmtD(calcs.yearlyData[9]?.taxSavingsOnly || 0)} highlight="gold" />
                  <div style={{ height: 8 }} />
                  <InfoRow label="Cancellation Penalty (12.5% FMV)" value={fmtD(marketValue * 0.125)} highlight="red" />
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 6 }}>
                    Penalty payable if contract cancelled. Exceeds cumulative savings until year {
                      calcs.annualSavings > 0 ? Math.ceil((marketValue * 0.125) / calcs.annualSavings) : "∞"
                    }. Non-renewal (10yr phase-out) avoids penalty.
                  </div>
                </div>

                {/* REPS note */}
                <div style={{
                  background: "#8B5CF610", border: "1px solid #8B5CF630", borderRadius: 10,
                  padding: 12, marginTop: 16
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#8B5CF6", marginBottom: 4, fontFamily: "'Space Mono',monospace" }}>
                    REPS + MILLS ACT STACK
                  </div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", lineHeight: 1.6 }}>
                    Jessi's REPS allows passive rental losses to offset your W2 income.
                    Mills Act reduces property tax (a deductible expense), which slightly reduces
                    the Schedule E deduction — but the direct tax bill savings far exceed the
                    lost deduction. Net benefit of Mills Act after REPS interaction:
                    <strong style={{ color: "#8B5CF6" }}> {fmtD(calcs.netTaxBenefit)}/yr</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 28, padding: "14px 0", borderTop: "1px solid #1F2937",
          fontSize: 9, color: "#4B5563", fontFamily: "'Space Mono',monospace",
          display: "flex", justifyContent: "space-between"
        }}>
          <span>Stella × Mills Act Calculator v1.0 · Not tax advice · Consult Kevin @ Bean Counters</span>
          <span>CA RTC §439-439.4 · SBE LTA 2025/030 · Palm Springs Muni Code §8.05</span>
        </div>
      </div>
    </div>
  );
}
