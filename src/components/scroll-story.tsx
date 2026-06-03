"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { company } from "@/lib/site-data";

const steps = [
  {
    label: "Survey",
    title: "Rooftop study first",
    text: "We review available roof area, shade, electrical load and the right solar capacity before recommending a system.",
  },
  {
    label: "Design",
    title: "A practical solar plan",
    text: "The proposal balances generation, mounting, safety equipment, inverter sizing and budget clarity.",
  },
  {
    label: "Install",
    title: "Installation and electrical work",
    text: "Annapurna Equipments handles solar installation and related electrical work with local Sangli support.",
  },
];

export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const progressWidth = useTransform(scrollYProgress, [0.15, 0.85], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="eyebrow">Scroll experience</p>
          <h2 className="heading-2 mt-4">From roof check to power savings, one smooth journey.</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Inspired by modern product landing pages, this section moves with the user and explains the solar journey in
            simple, scannable steps.
          </p>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div className="h-full rounded-full bg-blue-600" style={{ width: progressWidth }} />
          </div>
        </div>

        <div className="space-y-8">
          <motion.div
            className="glass-panel relative z-0 overflow-hidden rounded-[2rem] p-4"
            style={{ rotate }}
          >
            <motion.div
              className="h-[22rem] rounded-[1.55rem] bg-cover bg-center sm:h-[26rem] lg:h-[min(28rem,58vh)]"
              style={{ backgroundImage: `url(${company.images[1]})`, y: imageY }}
            />
          </motion.div>

          <div className="relative z-10 grid gap-5">
            {steps.map((step, index) => (
              <motion.article
                className="card min-h-56"
                initial={{ opacity: 0, y: 40 }}
                key={step.title}
                transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-80px" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="eyebrow">{step.label}</p>
                <h3 className="heading-3 mt-3">{step.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
