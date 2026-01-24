"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DataTable from "@/components/admin/DataTable";
import { Database } from "@/types/db";

type Experience = Database["public"]["Tables"]["experiences"]["Row"];

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    company: "",
    title: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    highlights: [] as string[],
  });

  useEffect(() => {
    fetchExperiences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchExperiences() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("owner_user_id", user.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      setExperiences((data || []).map(exp => ({
        ...exp,
        is_current: exp.is_current ?? false,
        highlights: exp.highlights ?? [],
        created_at: exp.created_at ?? '',
      })));
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const payload = {
        ...formData,
        end_date: formData.is_current ? null : formData.end_date,
      };

      if (editingExp) {
        const { error } = await supabase
          .from("experiences")
          .update(payload)
          .eq("id", editingExp.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("experiences")
          .insert({ ...payload, owner_user_id: user.id });
        if (error) throw error;
      }

      resetForm();
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  }

  async function handleDelete(exp: Experience) {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", exp.id);
      if (error) throw error;
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  }

  function handleEdit(exp: Experience) {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      title: exp.title,
      location: exp.location || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      is_current: exp.is_current,
      highlights: exp.highlights,
    });
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      company: "",
      title: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      highlights: [],
    });
    setShowForm(false);
    setEditingExp(null);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Experiences</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add Experience"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingExp ? "Edit Experience" : "Add New Experience"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
                disabled={formData.is_current}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm font-medium">Current Position</label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {editingExp ? "Update" : "Create"}
          </button>
        </form>
      )}

      <DataTable
        columns={[
          { key: "company", label: "Company" },
          { key: "title", label: "Title" },
          { key: "location", label: "Location" },
          { key: "start_date", label: "Start Date" },
        ]}
        data={experiences}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
