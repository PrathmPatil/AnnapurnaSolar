"use client";

import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(body.message ?? "Unable to login.");
      return;
    }

    window.location.href = "/cms/";
  }

  return (
    <form className="card mx-auto w-full max-w-md space-y-5" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Controller</p>
        <h1 className="heading-2 mt-3">Business console</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Private access for Annapurna Equipments CMS and solar operations.
        </p>
      </div>

      <label className="grid gap-2 text-sm font-bold text-slate-800">
        Email
        <input
          autoComplete="username"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          name="email"
          placeholder="admin@annapurna.local"
          type="email"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-800">
        Password
        <input
          autoComplete="current-password"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          name="password"
          placeholder="Enter password"
          type="password"
        />
      </label>

      <button className="btn-primary w-full justify-center" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Checking..." : "Open CMS"}
      </button>

      {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</p> : null}

      <p className="text-xs leading-6 text-slate-500">
        Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `MONGODB_URI` for
        production.
      </p>

    </form>
  );
}
