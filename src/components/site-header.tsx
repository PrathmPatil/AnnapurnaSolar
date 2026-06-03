"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { company, navGroups } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu(label: string) {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    setActiveGroup(label);
  }

  function scheduleClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    closeTimer.current = setTimeout(() => setActiveGroup(null), 180);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${company.name} home`}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-base font-black text-white shadow-lg shadow-blue-600/20">
            {company.shortName}
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight text-slate-950">{company.name}</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Rooftop Solar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div
              className="relative"
              key={group.label}
              onMouseEnter={() => openMenu(group.label)}
              onMouseLeave={scheduleClose}
            >
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeGroup === group.label ? "bg-slate-100 text-blue-700" : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                }`}
                onFocus={() => openMenu(group.label)}
                type="button"
              >
                {group.label}
              </button>
              <div className="absolute left-0 top-full h-4 w-full" />
              <div
                className={`absolute left-0 top-[calc(100%+0.65rem)] w-80 rounded-[1.6rem] border border-black/10 bg-white/95 p-3 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl transition duration-200 ${
                  activeGroup === group.label
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-2 opacity-0 pointer-events-none"
                }`}
                onMouseEnter={() => openMenu(group.label)}
                onMouseLeave={scheduleClose}
              >
                {group.items.map((item) => (
                  <Link
                    className={`block rounded-2xl p-3 transition hover:bg-slate-100 ${
                      pathname === item.href ? "bg-blue-50 text-blue-700" : "text-slate-800"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <span className="block text-sm font-bold">{item.label}</span>
                    {item.description ? (
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/solar-calculator/" className="text-sm font-bold text-blue-700">
            Calculate Savings
          </Link>
          <a className="btn-primary" href="#book-visit">
            Schedule a FREE Visit
          </a>
        </div>

        <button
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{group.label}</p>
                <div className="mt-2 grid gap-1">
                  {group.items.map((item) => (
                    <Link
                      className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-blue-50"
                      href={item.href}
                      key={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
