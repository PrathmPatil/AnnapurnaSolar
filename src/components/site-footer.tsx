import Link from "next/link";
import { company, navGroups } from "@/lib/site-data";

export function SiteFooter() {
  const offerings = navGroups[0]?.items ?? [];
  const solutions = navGroups[1]?.items ?? [];
  const quickLinks = navGroups[3]?.items ?? [];

  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-lg font-black">{company.shortName}</span>
            <div>
              <Link className="text-xl font-black text-white transition hover:text-slate-300" href="/cms/login/" title="Company controller">
                {company.name}
              </Link>
              <p className="text-sm text-slate-400">{company.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            {company.description}
          </p>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-bold text-amber-300">Contact Us</p>
            <p className="heading-3 mt-3 text-white">{company.phone}</p>
            <p className="text-sm text-slate-300">{company.email}</p>
            <p className="mt-3 text-xs leading-6 text-slate-400">{company.address}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
              <a className="text-amber-300 hover:text-amber-200" href={company.instagram}>
                Instagram
              </a>
              <a className="text-amber-300 hover:text-amber-200" href={company.facebook}>
                Facebook
              </a>
              <a className="text-amber-300 hover:text-amber-200" href={company.website}>
                Website
              </a>
            </div>
          </div>
        </div>

        <FooterColumn title="Our Offerings" items={offerings} />
        <FooterColumn title="Solar Solutions" items={solutions} />
        <FooterColumn title="Quick Links" items={quickLinks} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>Copyright 2026 / Privacy Policy / Terms of Service / Cancellation Policy</p>
          <p>
            Powered by{" "}
            <Link className="font-bold text-slate-200 transition hover:text-amber-300" href="/saas/">
              SwamiInfotech
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <Link className="text-sm font-semibold text-slate-200 transition hover:text-amber-300" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
