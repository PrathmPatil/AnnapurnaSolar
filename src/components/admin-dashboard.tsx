"use client";

import { FormEvent, useEffect, useState } from "react";

type Metric = { label: string; value: string; delta: string };
type Pipeline = { stage: string; count: number; value: string };
type Project = {
  _id?: string;
  customerName: string;
  systemSizeKw: number;
  city: string;
  status: string;
  value: number;
  nextAction: string;
  assignedTo: string;
  [key: string]: unknown;
};
type Lead = {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  pincode: string;
  city?: string;
  type?: string;
  monthlyBill: string;
  source?: string;
  stage?: string;
  notes?: string;
  [key: string]: unknown;
};
type Insight = { name: string; focus: string; lesson: string };
type Overview = {
  metrics: Metric[];
  pipeline: Pipeline[];
  projects: Project[];
  modules: string[];
  competitorInsights: Insight[];
  source: string;
};
type CmsField = { key: string; label: string; type: "text" | "textarea"; defaultValue: string };
type CmsPageOption = { slug: string; title: string; route: string };
type CmsPageState = {
  pages: CmsPageOption[];
  page: { slug: string; title: string; route: string; fields: CmsField[] };
  defaults: Record<string, string>;
  previous: Record<string, string>;
  current: Record<string, string>;
  source: string;
  updatedAt?: string | null;
};

const tabs = ["Command", "CMS", "Leads", "Projects", "Research"] as const;

export function AdminDashboard({ email }: { email: string }) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Command");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((response) => response.json())
      .then((body) => {
        if (body.ok) setOverview(body as Overview);
      })
      .catch(() => setMessage("Unable to load dashboard data."));
  }, []);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <section className="min-h-screen bg-[#f5f5f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">SwamiInfotech Solar SaaS</p>
            <h1 className="heading-2 mt-2 text-white">Annapurna CMS Controller</h1>
            <p className="mt-2 text-sm text-slate-300">Signed in as {email}</p>
          </div>
          <button className="btn-primary justify-center" onClick={logout} type="button">
            Logout
          </button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto rounded-full bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                active === tab ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
              key={tab}
              onClick={() => setActive(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {message ? <p className="mb-6 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{message}</p> : null}

        {active === "Command" ? <CommandPanel overview={overview} /> : null}
        {active === "CMS" ? <CmsPanel /> : null}
        {active === "Leads" ? <LeadPanel /> : null}
        {active === "Projects" ? <ProjectPanel overview={overview} /> : null}
        {active === "Research" ? <ResearchPanel overview={overview} /> : null}
      </div>
    </section>
  );
}

function CommandPanel({ overview }: { overview: Overview | null }) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(overview?.metrics ?? []).map((metric) => (
          <article className="card" key={metric.label}>
            <p className="text-sm font-bold text-slate-500">{metric.label}</p>
            <p className="heading-3 mt-2 text-blue-700">{metric.value}</p>
            <p className="mt-2 text-xs font-bold text-emerald-600">{metric.delta}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="card">
          <p className="eyebrow">Pipeline</p>
          <div className="mt-5 grid gap-3">
            {(overview?.pipeline ?? []).map((stage) => (
              <div className="rounded-2xl bg-slate-50 p-4" key={stage.stage}>
                <div className="flex items-center justify-between gap-3 text-sm font-bold">
                  <span>{stage.stage}</span>
                  <span>{stage.count} deals</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{stage.value}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="card">
          <p className="eyebrow">Feature OS</p>
          <h2 className="heading-3 mt-3">Lead-to-install solar operating system</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {(overview?.modules ?? []).map((module) => (
              <span className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700" key={module}>
                {module}
              </span>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function CmsPanel() {
  const [state, setState] = useState<CmsPageState | null>(null);
  const [selectedSlug, setSelectedSlug] = useState("home");
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [compareField, setCompareField] = useState<CmsField | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/pages?slug=${selectedSlug}`)
      .then((response) => response.json())
      .then((body) => {
        if (!active) return;
        if (body.ok) {
          setState(body as CmsPageState);
          setValues(body.current ?? {});
          setStatus("");
          setCompareField(null);
        } else {
          setStatus(body.message ?? "Unable to load page content.");
        }
      })
      .catch(() => setStatus("Unable to load page content."));
    return () => {
      active = false;
    };
  }, [selectedSlug]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/pages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: selectedSlug, values }),
    });
    const body = await response.json();
    if (response.ok) {
      setState(body as CmsPageState);
      setValues(body.current ?? values);
      setStatus("Page content saved. Previous and current values are now updated.");
    } else {
      setStatus(body.message ?? "Unable to save CMS page content.");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] xl:items-end">
          <div className="min-w-0">
            <p className="eyebrow">Content Management</p>
            <h2 className="heading-3 mt-2">All pages and page elements</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Select a page, compare default, previous and current values, then update the editable current content.
            </p>
          </div>
          <label className="grid min-w-0 gap-2 text-sm font-bold text-slate-800">
            Page
            <select
              className="w-full min-w-0 truncate rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              onChange={(event) => setSelectedSlug(event.target.value)}
              value={selectedSlug}
            >
              {(state?.pages ?? [{ slug: "home", title: "Home", route: "/" }]).map((page) => (
                <option key={page.slug} value={page.slug}>
                  {page.title} ({page.route})
                </option>
              ))}
            </select>
          </label>
        </div>

        {status ? <p className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{status}</p> : null}
      </div>

      {state ? (
        <form className="grid gap-5" onSubmit={save}>
          <div className="grid gap-5">
            {state.page.fields.map((field) => (
              <article className="card" key={field.key}>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-950">{field.label}</p>
                    <p className="text-xs font-semibold text-slate-500">{field.key}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                      onClick={() => setCompareField(field)}
                      type="button"
                    >
                      View default / previous
                    </button>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {field.type}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm font-bold text-slate-800">
                    Current
                    {field.type === "textarea" ? (
                      <textarea
                        className="min-h-32 rounded-2xl border border-blue-200 bg-blue-50/50 px-4 py-3 text-sm leading-7 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                        value={values[field.key] ?? ""}
                      />
                    ) : (
                      <input
                        className="rounded-2xl border border-blue-200 bg-blue-50/50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                        value={values[field.key] ?? ""}
                      />
                    )}
                  </label>
                </div>
              </article>
            ))}
          </div>
          {compareField ? (
            <ValueCompareModal
              defaultValue={state.defaults[compareField.key] ?? ""}
              field={compareField}
              onClose={() => setCompareField(null)}
              previousValue={state.previous[compareField.key] ?? ""}
            />
          ) : null}
          <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-[1.5rem] border border-black/10 bg-white/90 p-4 shadow-2xl backdrop-blur">
            <p className="text-xs font-semibold text-slate-500">
              Source: {state.source}. Public pages use current values when MongoDB is configured.
            </p>
            <button className="btn-primary shrink-0" type="submit">
              Save current page
            </button>
          </div>
        </form>
      ) : (
        <div className="card">Loading CMS fields...</div>
      )}
    </div>
  );
}

function ValueCompareModal({
  field,
  defaultValue,
  previousValue,
  onClose,
}: {
  field: CmsField;
  defaultValue: string;
  previousValue: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[86vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">CMS value history</p>
            <h2 className="heading-3 mt-2">{field.label}</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">{field.key}</p>
          </div>
          <button
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnlyValue label="Default" value={defaultValue} />
          <ReadOnlyValue label="Previous" value={previousValue} />
        </div>
      </div>
    </div>
  );
}

function ReadOnlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{value || "-"}</p>
    </div>
  );
}

function LeadPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState("");

  async function loadLeads() {
    const response = await fetch("/api/admin/leads");
    const body = await response.json();
    if (body.ok) {
      setLeads(body.leads ?? []);
    } else {
      setStatus(body.message ?? "Unable to load leads.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLeads();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function createLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (response.ok) {
      setStatus("Lead saved to CRM.");
      form.reset();
      await loadLeads();
    } else {
      setStatus(body.message ?? "Unable to save lead.");
    }
  }

  return (
    <div className="grid gap-6">
      {status ? <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{status}</p> : null}
      <form className="card grid gap-4" onSubmit={createLead}>
        <p className="eyebrow">CRM</p>
        <h2 className="heading-3">Create lead</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" name="name" placeholder="Customer name" />
          <Input label="Phone" name="phone" placeholder="9876543210" />
          <Input label="Email" name="email" placeholder="customer@example.com" />
          <Input label="Pincode" name="pincode" placeholder="416416" />
          <Input label="City" name="city" placeholder="Sangli" />
          <Input label="Monthly bill" name="monthlyBill" placeholder="Rs. 5,000 - Rs. 10,000" />
        </div>
        <button className="btn-primary w-fit" type="submit">
          Add lead
        </button>
      </form>

      <RecordOverview
        eyebrow="Previous leads"
        title="Lead history and details"
        description="Click any lead to view full customer, source, stage, estimate, notes, and audit-style details."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {leads.slice(0, 6).map((lead) => (
          <button className="card text-left transition hover:-translate-y-1 hover:shadow-2xl" key={recordKey(lead)} onClick={() => setSelectedLead(lead)} type="button">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">{String(lead.stage ?? "new")}</p>
                <h3 className="heading-3 mt-2">{lead.name}</h3>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{String(lead.type ?? "lead")}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {lead.city ?? "Unknown city"} · {lead.pincode} · {lead.monthlyBill}
            </p>
            <p className="mt-3 text-sm font-bold text-slate-800">{lead.phone}</p>
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{String(lead.notes ?? "No notes added.")}</p>
          </button>
        ))}
      </div>

      <RecordTable
        columns={["name", "phone", "city", "type", "stage", "monthlyBill", "source"]}
        onSelect={(record) => setSelectedLead(record as Lead)}
        records={leads}
      />

      {selectedLead ? (
        <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      ) : null}
    </div>
  );
}

function ProjectPanel({
  overview,
}: {
  overview: Overview | null;
}) {
  const [projects, setProjects] = useState<Project[]>(overview?.projects ?? []);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [status, setStatus] = useState("");

  async function loadProjects() {
    const response = await fetch("/api/admin/projects");
    const body = await response.json();
    if (body.ok) {
      setProjects(body.projects ?? []);
    } else {
      setStatus(body.message ?? "Unable to load projects.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProjects();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (response.ok) {
      setStatus("Project created.");
      form.reset();
      await loadProjects();
    } else {
      setStatus(body.message ?? "Unable to create project.");
    }
  }

  return (
    <div className="grid gap-6">
      {status ? <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{status}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <form className="card grid gap-4" onSubmit={createProject}>
          <p className="eyebrow">Projects</p>
          <h2 className="heading-3">Create project</h2>
          <Input label="Customer" name="customerName" placeholder="Customer or business" />
          <Input label="System size kW" name="systemSizeKw" placeholder="10" />
          <Input label="City" name="city" placeholder="Sangli" />
          <Input label="Value" name="value" placeholder="650000" />
          <Input label="Next action" name="nextAction" placeholder="Schedule site survey" />
          <Input label="Assigned to" name="assignedTo" placeholder="Operations" />
          <button className="btn-primary w-fit" type="submit">
            Create project
          </button>
        </form>
        <article className="card">
          <p className="eyebrow">Active jobs</p>
          <h2 className="heading-3 mt-2">Project cards</h2>
          <div className="mt-5 grid gap-3">
            {projects.map((project) => (
            <button className="rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-blue-50" key={recordKey(project)} onClick={() => setSelectedProject(project)} type="button">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold">{project.customerName}</p>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{project.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {project.systemSizeKw} kW · {project.city} · {project.nextAction}
              </p>
              <p className="mt-2 text-xs font-bold text-slate-500">Assigned to {project.assignedTo} · {formatCurrency(project.value)}</p>
            </button>
            ))}
          </div>
        </article>
      </div>

      <RecordOverview
        eyebrow="Previous projects"
        title="Project history and full work details"
        description="Project records include status, permit, payment, site address, survey summary, documents, timeline, value, owner, and next action."
      />

      <RecordTable
        columns={["customerName", "city", "status", "systemSizeKw", "value", "assignedTo", "nextAction"]}
        onSelect={(record) => setSelectedProject(record as Project)}
        records={projects}
      />

      {selectedProject ? (
        <RecordDetailsModal record={selectedProject} title={selectedProject.customerName} eyebrow="Project details" onClose={() => setSelectedProject(null)} />
      ) : null}
    </div>
  );
}

function RecordOverview({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <article className="card">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="heading-3 mt-2">{title}</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

function RecordTable({
  records,
  columns,
  onSelect,
}: {
  records: Record<string, unknown>[];
  columns: string[];
  onSelect: (record: Record<string, unknown>) => void;
}) {
  return (
    <article className="card overflow-hidden">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Table view</p>
          <h2 className="heading-3 mt-2">{records.length} records</h2>
        </div>
        <p className="text-xs font-bold text-slate-500">Click a row for details</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th className="px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400" key={column}>
                  {labelize(column)}
                </th>
              ))}
              <th className="px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr className="rounded-2xl bg-slate-50 transition hover:bg-blue-50" key={recordKey(record)}>
                {columns.map((column, index) => (
                  <td className={`px-4 py-4 ${index === 0 ? "rounded-l-2xl font-bold text-slate-950" : "text-slate-600"}`} key={column}>
                    {formatValue(record[column])}
                  </td>
                ))}
                <td className="rounded-r-2xl px-4 py-4">
                  <button className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm" onClick={() => onSelect(record)} type="button">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function RecordDetailsModal({
  record,
  title,
  eyebrow,
  onClose,
}: {
  record: Record<string, unknown>;
  title: string;
  eyebrow: string;
  onClose: () => void;
}) {
  const entries = Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== "");

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="heading-3 mt-2">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              Full record information is shown below in paragraph format for quick review and operational handoff.
            </p>
          </div>
          <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {entries.map(([key, value]) => (
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={key}>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{labelize(key)}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{formatValue(value)}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadDetailsModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[1.5rem] bg-slate-950 p-5 text-white sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">Lead details</p>
            <h2 className="heading-3 mt-2 text-white">{lead.name}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {lead.type ?? "lead"} lead from {lead.source ?? "unknown source"} currently in {lead.stage ?? "new"} stage.
            </p>
          </div>
          <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="grid gap-4">
            <DetailSection
              title="Contact Profile"
              items={[
                ["Customer name", lead.name],
                ["Phone number", lead.phone],
                ["Email address", lead.email ?? "Not provided"],
                ["City", lead.city ?? "Not provided"],
                ["PIN code", lead.pincode],
              ]}
            />
            <DetailSection
              title="Opportunity Snapshot"
              items={[
                ["Lead type", lead.type ?? "Not set"],
                ["Stage", lead.stage ?? "new"],
                ["Priority", lead.priority ?? "Not marked"],
                ["Monthly electricity bill", lead.monthlyBill],
                ["Expected project value", lead.expectedValue ? formatCurrency(lead.expectedValue) : "Not estimated"],
              ]}
            />
          </section>

          <section className="grid gap-4">
            <DetailSection
              title="Site And Solar Requirement"
              items={[
                ["Roof type", lead.roofType ?? "Not captured"],
                ["Estimated system size", lead.estimatedSystemSizeKw ? `${formatValue(lead.estimatedSystemSizeKw)} kW` : "Not estimated"],
                ["Lead source", lead.source ?? "Not captured"],
                ["Created at", lead.createdAt ? formatValue(lead.createdAt) : "Not captured"],
                ["Last updated", lead.updatedAt ? formatValue(lead.updatedAt) : "Not captured"],
              ]}
            />
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Notes and follow-up context</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {lead.notes ?? "No notes added for this lead yet."}
              </p>
            </article>
          </section>
        </div>

        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-500">Operational summary</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {lead.name} is a {lead.type ?? "solar"} enquiry from {lead.city ?? "the service area"} with an electricity
            bill range of {lead.monthlyBill}. The current CRM stage is {lead.stage ?? "new"}. The next useful action is
            to confirm site details, validate roof suitability, and prepare the savings or proposal workflow.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, items }: { title: string; items: [string, unknown][] }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.map(([label, value]) => (
          <div className="rounded-2xl bg-slate-50 p-3" key={label}>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{formatValue(value)}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ResearchPanel({ overview }: { overview: Overview | null }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {(overview?.competitorInsights ?? []).map((item) => (
        <article className="card" key={item.name}>
          <p className="eyebrow">{item.name}</p>
          <h2 className="heading-3 mt-3">{item.focus}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{item.lesson}</p>
        </article>
      ))}
    </div>
  );
}

function recordKey(record: Record<string, unknown>) {
  return String(record._id ?? `${record.name ?? record.customerName}-${record.phone ?? record.status}-${record.createdAt ?? record.city}`);
}

function labelize(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase())
    .replace(/_/g, " ");
}

function formatCurrency(value: unknown) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return formatValue(value);
  return `Rs. ${new Intl.NumberFormat("en-IN").format(amount)}`;
}

function formatValue(value: unknown): string {
  if (value instanceof Date) return value.toLocaleString("en-IN");
  if (typeof value === "number") return new Intl.NumberFormat("en-IN").format(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleString("en-IN");
  }
  if (typeof value === "object" && value !== null) {
    if ("$oid" in value && typeof value.$oid === "string") return value.$oid;
    return JSON.stringify(value, null, 2);
  }
  return String(value ?? "-");
}

function Input({ label, name, placeholder }: { label: string; name: string; placeholder: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" name={name} placeholder={placeholder} />
    </label>
  );
}

