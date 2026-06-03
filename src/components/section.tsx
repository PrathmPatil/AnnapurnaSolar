"use client";

import type { ReactNode } from "react";
import { MotionCard, Reveal } from "./motion-primitives";

export function Section({
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${className}`}>
      <Reveal className="mx-auto mb-10 max-w-3xl text-center">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="heading-2">{title}</h2>
        {intro ? <p className="mt-4 text-lg leading-8 text-slate-600">{intro}</p> : null}
      </Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </section>
  );
}

export function StatGrid({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <MotionCard className="card text-center" delay={indexDelay(index)} key={stat.label}>
          <p className="heading-3 text-blue-700">{stat.value}</p>
          <p className="mt-2 text-sm font-semibold text-slate-500">{stat.label}</p>
        </MotionCard>
      ))}
    </div>
  );
}

export function FeatureGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <MotionCard className="card group" delay={indexDelay(index)} key={item.title}>
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-lg font-black text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
            {index + 1}
          </div>
          <h3 className="heading-3">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
        </MotionCard>
      ))}
    </div>
  );
}

function indexDelay(index: number) {
  return Math.min(index * 0.05, 0.2);
}
