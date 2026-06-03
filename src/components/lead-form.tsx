"use client";

import { FormEvent, useState } from "react";
import { company } from "@/lib/site-data";

type LeadType = "home" | "commercial" | "society";

const billRanges = ["0 - Rs. 50,000", "Rs. 50,000 - Rs. 2 Lacs", "Above Rs. 2 Lacs"];

export function LeadForm({ type = "home", title }: { type?: LeadType; title?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        type,
        consent: formData.get("consent") === "on",
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(body.message ?? "Please check the form and try again.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage("Details submitted successfully. Our team will contact you shortly.");
  }

  return (
    <form className="card space-y-4" id="book-visit" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Book a FREE Visit</p>
        <h2 className="heading-3 mt-2">
          {title ?? "Our solar consultants will create a personalised savings plan."}
        </h2>
      </div>

      <Field label="Full Name" name="name" placeholder="Your name" />

      {type === "commercial" ? <Field label="Company Name" name="company" placeholder="Company name" /> : null}
      {type === "society" ? <Field label="Name of the Housing Society" name="society" placeholder="Society name" /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="PIN Code" name="pincode" placeholder="6-digit pincode" inputMode="numeric" maxLength={6} />
        <Field label="Whatsapp Number" name="phone" placeholder="10-digit number" inputMode="numeric" maxLength={10} />
      </div>

      {type === "commercial" ? <Field label="City" name="city" placeholder="City" /> : null}

      {type === "society" ? (
        <>
          <Select label="AGM Approval Status" name="agmStatus" options={["We already have AGM approval", "We do not have AGM approval yet", "We want help preparing for AGM"]} />
          <Select label="Designation in the Society" name="designation" options={["Management committee member", "Resident", "Builder", "Facility Manager"]} />
        </>
      ) : null}

      <Select label="Monthly Electricity Bill" name="monthlyBill" options={type === "home" ? ["Rs. 1,500 - Rs. 4,000", "Rs. 4,000 - Rs. 10,000", "Above Rs. 10,000"] : billRanges} />

      <label className="flex gap-3 text-xs leading-5 text-slate-600">
        <input className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700" name="consent" type="checkbox" />
        <span>I agree to {company.name} Terms of use and Privacy Policy.</span>
      </label>

      <button className="btn-primary w-full justify-center" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Submitting..." : "Get Started"}
      </button>

      {message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      ) : null}
      <p className="text-center text-xs font-bold text-amber-600">Limited slots only!</p>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  placeholder: string;
  inputMode?: "numeric";
  maxLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <input
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        inputMode={inputMode}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" name={name}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
