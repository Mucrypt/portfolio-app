import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Database } from "@/types/db";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Experience = Database["public"]["Tables"]["experiences"]["Row"];
type Skill = Database["public"]["Tables"]["skills"]["Row"];
type Education = Database["public"]["Tables"]["education"]["Row"];
type Language = Database["public"]["Tables"]["languages"]["Row"];
type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectLink = Database["public"]["Tables"]["project_links"]["Row"];
type ProjectMedia = Database["public"]["Tables"]["project_media"]["Row"];

function formatMonthYear(date: string | null) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(d);
}

function safeUrl(u?: string | null) {
  if (!u) return null;
  try {
    return new URL(u).toString();
  } catch {
    return null;
  }
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">{title}</h2>
      {subtitle ? <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{subtitle}</p> : null}
    </div>
  );
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("*").single<Profile>();

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false });

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("start_date", { ascending: false });

  const { data: languages } = await supabase
    .from("languages")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .order("year", { ascending: false });

  const { data: projects } = await supabase
    .from("projects")
    .select(`*, project_links(*), project_media(*)`)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(4);

  const p = profile as Profile | null;

  const socials = (p?.socials ?? {}) as Record<string, any>;
  const github = safeUrl(socials.github);
  const linkedin = safeUrl(socials.linkedin);
  const website = safeUrl(socials.website);

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {/* CV PAPER */}
        <div className="relative">
          {/* “Paper” */}
          <div className="absolute -inset-1 rounded-[28px] bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-60 blur-[10px]" />
          <div className="relative rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm shadow-2xl overflow-hidden">

            {/* CV HEADER (Europass vibe) */}
            <div className="p-6 md:p-8 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left: Identity */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                    {p?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.avatar_url} alt={p.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-2xl">👤</div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight">
                      {p?.full_name || "Romeo Mukulah"}
                    </h1>
                    <p className="text-base md:text-lg font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
                      {p?.headline || "Junior Software Developer • Carpenter / Fabricator"}
                    </p>

                    {p?.role_tags?.length ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {p.role_tags.slice(0, 6).map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Right: Contact block */}
                <div className="min-w-65 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 p-4">
                  <div className="text-xs font-black tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    PERSONAL INFORMATION
                  </div>
                  <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {p?.location ? <div className="flex gap-2"><span>📍</span><span>{p.location}</span></div> : null}
                    {p?.email ? <div className="flex gap-2"><span>✉️</span><span className="break-all">{p.email}</span></div> : null}
                    {p?.phone ? <div className="flex gap-2"><span>📞</span><span>{p.phone}</span></div> : null}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {github ? (
                        <a className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline" href={github} target="_blank" rel="noreferrer">
                          GitHub
                        </a>
                      ) : null}
                      {linkedin ? (
                        <a className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline" href={linkedin} target="_blank" rel="noreferrer">
                          LinkedIn
                        </a>
                      ) : null}
                      {website ? (
                        <a className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline" href={website} target="_blank" rel="noreferrer">
                          Website
                        </a>
                      ) : null}
                      {p?.cv_url ? (
                        <a className="text-xs font-black text-zinc-900 dark:text-white hover:underline" href={p.cv_url} target="_blank" rel="noreferrer">
                          Download CV
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {p?.bio ||
                      "From Cameroon furniture workshops to construction sites in Italy, I developed discipline, precision, and problem-solving. Today I bring that same mindset into software — building React/Next.js and React Native apps backed by Node.js and databases like PostgreSQL, MySQL, MongoDB and Supabase."}
                  </p>
                </div>
                <div className="md:col-span-4 flex items-center gap-3">
                  <Link
                    href="/projects"
                    className="w-full px-5 py-3 rounded-2xl font-black bg-blue-600 text-white text-center hover:opacity-90"
                  >
                    View Projects
                  </Link>
                  <Link
                    href="/about"
                    className="w-full px-5 py-3 rounded-2xl font-black bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-center hover:shadow"
                  >
                    My Story
                  </Link>
                </div>
              </div>
            </div>

            {/* BODY: 2-COLUMN CV */}
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* LEFT COLUMN */}
              <div className="md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/30">
                {/* Skills */}
                <div className="mb-8">
                  <SectionTitle title="Skills" subtitle="Technical + Practical" />
                  <div className="space-y-3">
                    {(skills as Skill[] | null)?.slice(0, 14).map((s) => (
                      <div key={s.id}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-semibold text-zinc-800 dark:text-zinc-100">{s.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400">{s.level}/5</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"
                            style={{ width: `${Math.min(100, Math.max(0, (s.level / 5) * 100))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <Link href="/skills" className="inline-block mt-3 text-sm font-black text-blue-600 dark:text-blue-400 hover:underline">
                      View all skills →
                    </Link>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-8">
                  <SectionTitle title="Languages" />
                  <div className="space-y-2">
                    {(languages as Language[] | null)?.map((l) => (
                      <div key={l.id} className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-100">{l.name}</span>
                        <span className="text-zinc-500 dark:text-zinc-400">{l.level || ""}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="mb-8">
                  <SectionTitle title="Education" />
                  <div className="space-y-3">
                    {(education as Education[] | null)?.map((e) => (
                      <div key={e.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950/30">
                        <p className="font-black text-zinc-900 dark:text-white">{e.school}</p>
                        {e.program ? <p className="font-semibold text-blue-600 dark:text-blue-400">{e.program}</p> : null}
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {formatMonthYear(e.start_date)} — {formatMonthYear(e.end_date) || "Present"}
                          {e.location ? ` • ${e.location}` : ""}
                        </p>
                        {e.notes ? <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">{e.notes}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates */}
                <div>
                  <SectionTitle title="Certificates" />
                  <div className="space-y-3">
                    {(certificates as Certificate[] | null)?.map((c) => (
                      <div key={c.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950/30">
                        <p className="font-black text-zinc-900 dark:text-white">{c.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {(c.issuer || "Issuer")} {c.year ? `• ${c.year}` : ""}
                        </p>
                        {c.url ? (
                          <a className="inline-block mt-2 text-sm font-black text-blue-600 dark:text-blue-400 hover:underline" href={c.url} target="_blank" rel="noreferrer">
                            View →
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="md:col-span-8 p-6 md:p-8">
                {/* Experience */}
                <div className="mb-10">
                  <SectionTitle title="Professional Experience" subtitle="Timeline style (CV)" />
                  <div className="space-y-6">
                    {(experiences as Experience[] | null)?.map((exp) => (
                      <div key={exp.id} className="relative pl-6">
                        <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-blue-600" />
                        <div className="absolute left-1.25 top-6 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />

                        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-950/30">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                              <h3 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white">{exp.title}</h3>
                              <p className="font-bold text-blue-600 dark:text-blue-400">{exp.company}</p>
                              {exp.location ? <p className="text-sm text-zinc-600 dark:text-zinc-400">📍 {exp.location}</p> : null}
                            </div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400 md:text-right">
                              {formatMonthYear(exp.start_date)} — {exp.is_current ? "Present" : formatMonthYear(exp.end_date) || "Present"}
                            </div>
                          </div>

                          {exp.highlights?.length ? (
                            <ul className="mt-4 space-y-2">
                              {exp.highlights.map((h, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                                  <span className="mt-1 text-blue-500">▸</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Projects (CV-like, compact but rich) */}
                {projects?.length ? (
                  <div>
                    <div className="flex items-end justify-between gap-4 mb-4">
                      <SectionTitle title="Projects" subtitle="Live links + GitHub + media" />
                      <Link href="/projects" className="text-sm font-black text-blue-600 dark:text-blue-400 hover:underline">
                        View all →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(projects as any[]).map(
                        (project: Project & { project_links: ProjectLink[]; project_media: ProjectMedia[] }) => {
                          const cover = project.project_media
                            ?.slice()
                            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];

                          return (
                            <div
                              key={project.id}
                              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 overflow-hidden hover:shadow-xl transition"
                            >
                              {cover?.url ? (
                                <div className="aspect-video bg-zinc-100 dark:bg-zinc-900">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={cover.url} alt={cover.alt || project.title} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 grid place-items-center text-3xl">🧩</div>
                              )}

                              <div className="p-5">
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white">{project.title}</h3>
                                {project.summary ? (
                                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">{project.summary}</p>
                                ) : null}

                                {project.tech_stack?.length ? (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {project.tech_stack.slice(0, 6).map((t) => (
                                      <span
                                        key={t}
                                        className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}

                                {project.project_links?.length ? (
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {project.project_links.map((l) => (
                                      <a
                                        key={l.id}
                                        href={l.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 rounded-xl text-sm font-black bg-blue-600 text-white hover:opacity-90"
                                      >
                                        {l.label}
                                      </a>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Footer strip like a document */}
            <div className="px-6 md:px-8 py-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Portfolio CV • Powered by Supabase</span>
              <span>Last updated: {p?.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
