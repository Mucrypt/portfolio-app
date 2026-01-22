"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type AboutPage = {
  id: string;
  owner_user_id: string;
  hero_eyebrow: string | null;
  hero_title: string;
  hero_subtitle: string | null;
  intro: string | null;
  mission: string | null;
  cta_primary_label: string | null;
  cta_primary_href: string | null;
  cta_secondary_label: string | null;
  cta_secondary_href: string | null;
  is_published: boolean;
};

type AboutSection = {
  id: string;
  owner_user_id: string;
  title: string | null;
  subtitle: string | null;
  content: string;
  kind: string;
  sort_order: number;
  is_visible: boolean;
};

type AboutTimeline = {
  id: string;
  owner_user_id: string;
  country: string;
  city: string | null;
  title: string;
  period: string | null;
  description: string;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
};

type AboutHighlight = {
  id: string;
  owner_user_id: string;
  group_key: string;
  title: string;
  description: string;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
};

type AboutQuote = {
  id: string;
  owner_user_id: string;
  quote: string;
  caption: string | null;
  theme: string;
  sort_order: number;
  is_visible: boolean;
};

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<"page" | "sections" | "timeline" | "highlights" | "quotes">("page");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  // About Page state
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null);
  const [pageForm, setPageForm] = useState({
    hero_eyebrow: "",
    hero_title: "",
    hero_subtitle: "",
    intro: "",
    mission: "",
    cta_primary_label: "View My Work",
    cta_primary_href: "/projects",
    cta_secondary_label: "Contact Me",
    cta_secondary_href: "/contact",
    is_published: true,
  });

  // Sections state
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [sectionForm, setSectionForm] = useState({
    title: "",
    subtitle: "",
    content: "",
    kind: "story",
    sort_order: 0,
    is_visible: true,
  });

  // Timeline state
  const [timeline, setTimeline] = useState<AboutTimeline[]>([]);
  const [editingTimeline, setEditingTimeline] = useState<AboutTimeline | null>(null);
  const [timelineForm, setTimelineForm] = useState({
    country: "",
    city: "",
    title: "",
    period: "",
    description: "",
    icon: "",
    sort_order: 0,
    is_visible: true,
  });

  // Highlights state
  const [highlights, setHighlights] = useState<AboutHighlight[]>([]);
  const [editingHighlight, setEditingHighlight] = useState<AboutHighlight | null>(null);
  const [highlightForm, setHighlightForm] = useState({
    group_key: "craft_to_code",
    title: "",
    description: "",
    icon: "",
    sort_order: 0,
    is_visible: true,
  });

  // Quotes state
  const [quotes, setQuotes] = useState<AboutQuote[]>([]);
  const [editingQuote, setEditingQuote] = useState<AboutQuote | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    quote: "",
    caption: "",
    theme: "dark",
    sort_order: 0,
    is_visible: true,
  });

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (activeTab === "page") {
      const { data } = await supabase.from("about_page").select("*").eq("owner_user_id", user.id).maybeSingle();
      if (data) {
        setAboutPage(data);
        setPageForm({
          hero_eyebrow: data.hero_eyebrow || "",
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle || "",
          intro: data.intro || "",
          mission: data.mission || "",
          cta_primary_label: data.cta_primary_label || "View My Work",
          cta_primary_href: data.cta_primary_href || "/projects",
          cta_secondary_label: data.cta_secondary_label || "Contact Me",
          cta_secondary_href: data.cta_secondary_href || "/contact",
          is_published: data.is_published,
        });
      }
    } else if (activeTab === "sections") {
      const { data } = await supabase.from("about_sections").select("*").eq("owner_user_id", user.id).order("sort_order");
      setSections(data || []);
    } else if (activeTab === "timeline") {
      const { data } = await supabase.from("about_timeline").select("*").eq("owner_user_id", user.id).order("sort_order");
      setTimeline(data || []);
    } else if (activeTab === "highlights") {
      const { data } = await supabase.from("about_highlights").select("*").eq("owner_user_id", user.id).order("sort_order");
      setHighlights(data || []);
    } else if (activeTab === "quotes") {
      const { data } = await supabase.from("about_quotes").select("*").eq("owner_user_id", user.id).order("sort_order");
      setQuotes(data || []);
    }
  }, [activeTab, supabase]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  async function saveAboutPage() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = aboutPage
      ? await supabase.from("about_page").update(pageForm).eq("id", aboutPage.id)
      : await supabase.from("about_page").insert({ ...pageForm, owner_user_id: user.id });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("About page saved successfully!");
      loadData();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function saveSection() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = editingSection
      ? await supabase.from("about_sections").update(sectionForm).eq("id", editingSection.id)
      : await supabase.from("about_sections").insert({ ...sectionForm, owner_user_id: user.id });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Section saved!");
      setEditingSection(null);
      setSectionForm({ title: "", subtitle: "", content: "", kind: "story", sort_order: 0, is_visible: true });
      loadData();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section?")) return;
    const { error } = await supabase.from("about_sections").delete().eq("id", id);
    if (!error) {
      setMessage("Section deleted!");
      loadData();
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function saveTimeline() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = editingTimeline
      ? await supabase.from("about_timeline").update(timelineForm).eq("id", editingTimeline.id)
      : await supabase.from("about_timeline").insert({ ...timelineForm, owner_user_id: user.id });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Timeline saved!");
      setEditingTimeline(null);
      setTimelineForm({ country: "", city: "", title: "", period: "", description: "", icon: "", sort_order: 0, is_visible: true });
      loadData();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function deleteTimeline(id: string) {
    if (!confirm("Delete this timeline item?")) return;
    const { error } = await supabase.from("about_timeline").delete().eq("id", id);
    if (!error) {
      setMessage("Timeline deleted!");
      loadData();
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function saveHighlight() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = editingHighlight
      ? await supabase.from("about_highlights").update(highlightForm).eq("id", editingHighlight.id)
      : await supabase.from("about_highlights").insert({ ...highlightForm, owner_user_id: user.id });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Highlight saved!");
      setEditingHighlight(null);
      setHighlightForm({ group_key: "craft_to_code", title: "", description: "", icon: "", sort_order: 0, is_visible: true });
      loadData();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function deleteHighlight(id: string) {
    if (!confirm("Delete this highlight?")) return;
    const { error } = await supabase.from("about_highlights").delete().eq("id", id);
    if (!error) {
      setMessage("Highlight deleted!");
      loadData();
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function saveQuote() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = editingQuote
      ? await supabase.from("about_quotes").update(quoteForm).eq("id", editingQuote.id)
      : await supabase.from("about_quotes").insert({ ...quoteForm, owner_user_id: user.id });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Quote saved!");
      setEditingQuote(null);
      setQuoteForm({ quote: "", caption: "", theme: "dark", sort_order: 0, is_visible: true });
      loadData();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function deleteQuote(id: string) {
    if (!confirm("Delete this quote?")) return;
    const { error } = await supabase.from("about_quotes").delete().eq("id", id);
    if (!error) {
      setMessage("Quote deleted!");
      loadData();
    }
    setTimeout(() => setMessage(""), 3000);
  }

  const tabs = [
    { id: "page", label: "Main Page" },
    { id: "timeline", label: "Timeline" },
    { id: "sections", label: "Sections" },
    { id: "highlights", label: "Highlights" },
    { id: "quotes", label: "Quotes" },
  ] as const;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage About Page</h1>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN PAGE TAB */}
      {activeTab === "page" && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Hero Eyebrow</label>
            <input
              type="text"
              value={pageForm.hero_eyebrow}
              onChange={(e) => setPageForm({ ...pageForm, hero_eyebrow: e.target.value })}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
              placeholder="🌍 Cameroon → Algeria → Italy → Software"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Hero Title *</label>
            <input
              type="text"
              value={pageForm.hero_title}
              onChange={(e) => setPageForm({ ...pageForm, hero_title: e.target.value })}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
              placeholder="I build things that last..."
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Hero Subtitle</label>
            <input
              type="text"
              value={pageForm.hero_subtitle}
              onChange={(e) => setPageForm({ ...pageForm, hero_subtitle: e.target.value })}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Intro</label>
            <textarea
              value={pageForm.intro}
              onChange={(e) => setPageForm({ ...pageForm, intro: e.target.value })}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
              rows={3}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Mission</label>
            <textarea
              value={pageForm.mission}
              onChange={(e) => setPageForm({ ...pageForm, mission: e.target.value })}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
              rows={2}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Primary CTA Label</label>
              <input
                type="text"
                value={pageForm.cta_primary_label}
                onChange={(e) => setPageForm({ ...pageForm, cta_primary_label: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Primary CTA Link</label>
              <input
                type="text"
                value={pageForm.cta_primary_href}
                onChange={(e) => setPageForm({ ...pageForm, cta_primary_href: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Secondary CTA Label</label>
              <input
                type="text"
                value={pageForm.cta_secondary_label}
                onChange={(e) => setPageForm({ ...pageForm, cta_secondary_label: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Secondary CTA Link</label>
              <input
                type="text"
                value={pageForm.cta_secondary_href}
                onChange={(e) => setPageForm({ ...pageForm, cta_secondary_href: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={pageForm.is_published}
              onChange={(e) => setPageForm({ ...pageForm, is_published: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="font-semibold">Published</label>
          </div>
          <button
            onClick={saveAboutPage}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Main Page"}
          </button>
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div>
          <div className="mb-6 p-4 border rounded dark:bg-zinc-800">
            <h3 className="text-xl font-bold mb-4">{editingTimeline ? "Edit Timeline" : "Add Timeline Item"}</h3>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Country *</label>
                  <input
                    type="text"
                    value={timelineForm.country}
                    onChange={(e) => setTimelineForm({ ...timelineForm, country: e.target.value })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">City</label>
                  <input
                    type="text"
                    value={timelineForm.city}
                    onChange={(e) => setTimelineForm({ ...timelineForm, city: e.target.value })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={timelineForm.title}
                  onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Period</label>
                <input
                  type="text"
                  value={timelineForm.period}
                  onChange={(e) => setTimelineForm({ ...timelineForm, period: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  placeholder="2008-2016"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Description *</label>
                <textarea
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  rows={3}
                  required
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Icon (emoji)</label>
                  <input
                    type="text"
                    value={timelineForm.icon}
                    onChange={(e) => setTimelineForm({ ...timelineForm, icon: e.target.value })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                    placeholder="🇨🇲"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={timelineForm.sort_order}
                    onChange={(e) => setTimelineForm({ ...timelineForm, sort_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timelineForm.is_visible}
                      onChange={(e) => setTimelineForm({ ...timelineForm, is_visible: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Visible</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveTimeline}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                >
                  {loading ? "Saving..." : editingTimeline ? "Update" : "Add"}
                </button>
                {editingTimeline && (
                  <button
                    onClick={() => {
                      setEditingTimeline(null);
                      setTimelineForm({ country: "", city: "", title: "", period: "", description: "", icon: "", sort_order: 0, is_visible: true });
                    }}
                    className="px-6 py-2 bg-zinc-500 text-white rounded font-semibold hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Timeline Items ({timeline.length})</h3>
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.id} className="p-4 border rounded dark:bg-zinc-800 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <strong className="text-lg">{item.country}</strong>
                    {item.city && <span className="text-sm text-zinc-500">({item.city})</span>}
                    {!item.is_visible && <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">Hidden</span>}
                  </div>
                  <div className="font-semibold">{item.title}</div>
                  {item.period && <div className="text-sm text-zinc-500">{item.period}</div>}
                  <p className="text-zinc-700 dark:text-zinc-300 mt-2">{item.description}</p>
                  <div className="text-xs text-zinc-500 mt-2">Order: {item.sort_order}</div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingTimeline(item);
                      setTimelineForm({
                        country: item.country,
                        city: item.city || "",
                        title: item.title,
                        period: item.period || "",
                        description: item.description,
                        icon: item.icon || "",
                        sort_order: item.sort_order,
                        is_visible: item.is_visible,
                      });
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTimeline(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTIONS TAB */}
      {activeTab === "sections" && (
        <div>
          <div className="mb-6 p-4 border rounded dark:bg-zinc-800">
            <h3 className="text-xl font-bold mb-4">{editingSection ? "Edit Section" : "Add Section"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Subtitle</label>
                <input
                  type="text"
                  value={sectionForm.subtitle}
                  onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Content *</label>
                <textarea
                  value={sectionForm.content}
                  onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  rows={5}
                  required
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Kind</label>
                  <select
                    value={sectionForm.kind}
                    onChange={(e) => setSectionForm({ ...sectionForm, kind: e.target.value })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  >
                    <option value="story">Story</option>
                    <option value="craft_to_code">Craft to Code</option>
                    <option value="philosophy">Philosophy</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={sectionForm.sort_order}
                    onChange={(e) => setSectionForm({ ...sectionForm, sort_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sectionForm.is_visible}
                      onChange={(e) => setSectionForm({ ...sectionForm, is_visible: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Visible</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveSection}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                >
                  {loading ? "Saving..." : editingSection ? "Update" : "Add"}
                </button>
                {editingSection && (
                  <button
                    onClick={() => {
                      setEditingSection(null);
                      setSectionForm({ title: "", subtitle: "", content: "", kind: "story", sort_order: 0, is_visible: true });
                    }}
                    className="px-6 py-2 bg-zinc-500 text-white rounded font-semibold hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Sections ({sections.length})</h3>
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="p-4 border rounded dark:bg-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    {section.title && <div className="font-bold text-lg">{section.title}</div>}
                    {section.subtitle && <div className="text-sm text-zinc-500">{section.subtitle}</div>}
                    <div className="text-xs text-zinc-500 mt-1">Kind: {section.kind} | Order: {section.sort_order}</div>
                    {!section.is_visible && <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">Hidden</span>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingSection(section);
                        setSectionForm({
                          title: section.title || "",
                          subtitle: section.subtitle || "",
                          content: section.content,
                          kind: section.kind,
                          sort_order: section.sort_order,
                          is_visible: section.is_visible,
                        });
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 mt-2">{section.content.substring(0, 200)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HIGHLIGHTS TAB */}
      {activeTab === "highlights" && (
        <div>
          <div className="mb-6 p-4 border rounded dark:bg-zinc-800">
            <h3 className="text-xl font-bold mb-4">{editingHighlight ? "Edit Highlight" : "Add Highlight"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-2">Group Key</label>
                <select
                  value={highlightForm.group_key}
                  onChange={(e) => setHighlightForm({ ...highlightForm, group_key: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                >
                  <option value="craft_to_code">Craft to Code</option>
                  <option value="principles">Principles</option>
                  <option value="proof">Proof</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={highlightForm.title}
                  onChange={(e) => setHighlightForm({ ...highlightForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Description *</label>
                <textarea
                  value={highlightForm.description}
                  onChange={(e) => setHighlightForm({ ...highlightForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  rows={2}
                  required
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Icon (emoji)</label>
                  <input
                    type="text"
                    value={highlightForm.icon}
                    onChange={(e) => setHighlightForm({ ...highlightForm, icon: e.target.value })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                    placeholder="🎯"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={highlightForm.sort_order}
                    onChange={(e) => setHighlightForm({ ...highlightForm, sort_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={highlightForm.is_visible}
                      onChange={(e) => setHighlightForm({ ...highlightForm, is_visible: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Visible</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveHighlight}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                >
                  {loading ? "Saving..." : editingHighlight ? "Update" : "Add"}
                </button>
                {editingHighlight && (
                  <button
                    onClick={() => {
                      setEditingHighlight(null);
                      setHighlightForm({ group_key: "craft_to_code", title: "", description: "", icon: "", sort_order: 0, is_visible: true });
                    }}
                    className="px-6 py-2 bg-zinc-500 text-white rounded font-semibold hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Highlights ({highlights.length})</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {highlights.map((highlight) => (
              <div key={highlight.id} className="p-4 border rounded dark:bg-zinc-800">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{highlight.icon}</span>
                    <div>
                      <div className="font-bold">{highlight.title}</div>
                      <div className="text-xs text-zinc-500">{highlight.group_key} | Order: {highlight.sort_order}</div>
                      {!highlight.is_visible && <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">Hidden</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingHighlight(highlight);
                        setHighlightForm({
                          group_key: highlight.group_key,
                          title: highlight.title,
                          description: highlight.description,
                          icon: highlight.icon || "",
                          sort_order: highlight.sort_order,
                          is_visible: highlight.is_visible,
                        });
                      }}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHighlight(highlight.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Del
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUOTES TAB */}
      {activeTab === "quotes" && (
        <div>
          <div className="mb-6 p-4 border rounded dark:bg-zinc-800">
            <h3 className="text-xl font-bold mb-4">{editingQuote ? "Edit Quote" : "Add Quote"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-2">Quote *</label>
                <textarea
                  value={quoteForm.quote}
                  onChange={(e) => setQuoteForm({ ...quoteForm, quote: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Caption</label>
                <input
                  type="text"
                  value={quoteForm.caption}
                  onChange={(e) => setQuoteForm({ ...quoteForm, caption: e.target.value })}
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Theme</label>
                  <select
                    value={quoteForm.theme}
                    onChange={(e) => setQuoteForm({ ...quoteForm, theme: e.target.value })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={quoteForm.sort_order}
                    onChange={(e) => setQuoteForm({ ...quoteForm, sort_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-700"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={quoteForm.is_visible}
                      onChange={(e) => setQuoteForm({ ...quoteForm, is_visible: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Visible</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveQuote}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                >
                  {loading ? "Saving..." : editingQuote ? "Update" : "Add"}
                </button>
                {editingQuote && (
                  <button
                    onClick={() => {
                      setEditingQuote(null);
                      setQuoteForm({ quote: "", caption: "", theme: "dark", sort_order: 0, is_visible: true });
                    }}
                    className="px-6 py-2 bg-zinc-500 text-white rounded font-semibold hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Quotes ({quotes.length})</h3>
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div key={quote.id} className="p-4 border rounded dark:bg-zinc-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-lg italic mb-2">&ldquo;{quote.quote}&rdquo;</p>
                    {quote.caption && <p className="text-sm text-zinc-500">— {quote.caption}</p>}
                    <div className="text-xs text-zinc-500 mt-2">
                      Theme: {quote.theme} | Order: {quote.sort_order}
                      {!quote.is_visible && <span className="ml-2 bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">Hidden</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingQuote(quote);
                        setQuoteForm({
                          quote: quote.quote,
                          caption: quote.caption || "",
                          theme: quote.theme,
                          sort_order: quote.sort_order,
                          is_visible: quote.is_visible,
                        });
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuote(quote.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
