"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/db";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    location: "",
    email: "",
    phone: "",
    bio: "",
    role_tags: "",
    avatar_url: "",
    cv_url: "",
    socials: {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("owner_user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name,
          headline: data.headline || "",
          location: data.location || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          role_tags: data.role_tags.join(", "),
          avatar_url: data.avatar_url || "",
          cv_url: data.cv_url || "",
          socials: {
            github: data.socials?.github || "",
            linkedin: data.socials?.linkedin || "",
            twitter: data.socials?.twitter || "",
            website: data.socials?.website || "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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
        owner_user_id: user.id,
        full_name: formData.full_name,
        headline: formData.headline,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        role_tags: formData.role_tags.split(",").map(t => t.trim()).filter(Boolean),
        avatar_url: formData.avatar_url,
        cv_url: formData.cv_url,
        socials: formData.socials,
        updated_at: new Date().toISOString(),
      };

      if (profile) {
        const { error } = await supabase
          .from("profiles")
          .update(payload)
          .eq("id", profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("profiles")
          .insert(payload);
        if (error) throw error;
      }

      alert("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              required
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Headline</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              placeholder="Full Stack Developer | Designer | Creator"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              placeholder="New York, NY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.role_tags}
              onChange={(e) => setFormData({ ...formData, role_tags: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              placeholder="Developer, Designer, Engineer"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar URL</label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">CV/Resume URL</label>
            <input
              type="url"
              value={formData.cv_url}
              onChange={(e) => setFormData({ ...formData, cv_url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="url"
                value={formData.socials.github}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socials: { ...formData.socials, github: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                value={formData.socials.linkedin}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socials: { ...formData.socials, linkedin: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Twitter</label>
              <input
                type="url"
                value={formData.socials.twitter}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socials: { ...formData.socials, twitter: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                value={formData.socials.website}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socials: { ...formData.socials, website: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
