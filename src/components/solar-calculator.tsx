"use client";

import { FormEvent, useState } from "react";
import type { CalculatorResult } from "@/lib/solar-calculator";

export function SolarCalculator({ compact = false }: { compact?: boolean }) {
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pincode: formData.get("pincode"),
        monthlyBill: Number(formData.get("monthlyBill")),
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(body.message ?? "Please enter valid details.");
      return;
    }

    setResult(body.result);
    setStatus("idle");
  }

  return (
    <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-[0.9fr_1.1fr]"}`}>
      <form className="card space-y-5" onSubmit={onSubmit}>
        <div>
          <p className="eyebrow">Calculate your savings</p>
          <h2 className="heading-3 mt-2">Unlock Your Solar Savings</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Enter your pincode and average monthly electricity bill to calculate your rooftop solar potential.
          </p>
        </div>
        <label className="grid gap-2 text-sm font-bold text-slate-800">
          PIN Code
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            inputMode="numeric"
            maxLength={6}
            name="pincode"
            placeholder="Enter a valid 6-digit pincode"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-800">
          Avg electricity bill
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            inputMode="numeric"
            min={500}
            name="monthlyBill"
            placeholder="Min. 500 Max Rs. 10,000"
            type="number"
          />
        </label>
        <button className="btn-primary w-full justify-center" disabled={status === "loading"} type="submit">
          {status === "loading" ? "Calculating..." : "Calculate now"}
        </button>
        {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</p> : null}
      </form>

      <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-700 to-slate-950 p-1 shadow-2xl">
        <div className="h-full rounded-[1.8rem] bg-white p-6">
          {result ? (
            <div className="space-y-6">
              <div>
                <p className="eyebrow">{result.serviceable ? `${result.city}, ${result.state}` : "Coming soon"}</p>
                <h3 className="heading-3 mt-2">Your Solar Savings</h3>
                {!result.serviceable ? (
                  <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                    We are not yet serviceable at this location, but this estimate shows your solar potential.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Metric label="Required System Size" value={`${result.systemSizeKw} kW`} />
                <Metric label="Roof Area" value={`${result.roofAreaSqft} sq. ft.`} />
                <Metric label="Monthly Savings" value={`Rs. ${format(result.monthlySavings)}`} />
                <Metric label="Yearly Savings" value={`Rs. ${format(result.yearlySavings)}`} />
                <Metric label="Lifetime Savings" value={`Rs. ${format(result.lifetimeSavings)}`} />
                <Metric label="Estimated EMI" value={`Rs. ${format(result.emi)}/mo`} />
              </div>

              <div className="rounded-3xl bg-blue-50 p-5">
                <p className="font-black text-slate-950">Your solar saves more than money</p>
                <div className="mt-4 grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-3">
                  <span>{format(result.co2MitigatedKg)} kg CO2 mitigated</span>
                  <span>{result.treesEquivalent} trees equivalent</span>
                  <span>{format(result.distanceEquivalentKm)} km green impact</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-96 flex-col justify-center rounded-3xl bg-slate-50 p-8 text-center">
              <p className="heading-1 text-blue-100">0</p>
              <h3 className="heading-3 mt-3">Required System Size</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Your system size, savings, cost, EMI and environmental impact will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="heading-3 mt-2 text-blue-700">{value}</p>
    </div>
  );
}

function format(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}
