"use client";

import { useState } from "react";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto grid max-w-4xl gap-3">
      {items.map((item, index) => (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm" key={item.question}>
          <button
            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            type="button"
          >
            <span className="text-base font-black text-slate-950">{item.question}</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-lg font-black text-blue-700">
              {openIndex === index ? "-" : "+"}
            </span>
          </button>
          {openIndex === index ? <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{item.answer}</p> : null}
        </div>
      ))}
    </div>
  );
}
