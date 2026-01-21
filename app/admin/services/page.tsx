'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  full_description: string;
  icon: string;
  color: string;
  featured_image_url: string;
  gallery_images: string[];
  category: string;
  subcategories: string[];
  service_type: string;
  base_price: number;
  price_currency: string;
  price_unit: string;
  pricing_tiers: any;
  is_price_negotiable: boolean;
  estimated_duration: string;
  duration_unit: string;
  min_duration: number;
  max_duration: number;
  is_available: boolean;
  availability_status: string;
  key_features: string[];
  deliverables: string[];
  included_services: string[];
  excluded_services: string[];
  requirements: string[];
  technologies: string[];
  tools: string[];
  methodologies: string[];
  languages: string[];
  process_steps: any;
  portfolio_project_ids: string[];
  case_study_urls: string[];
  demo_url: string;
  github_repo_url: string;
  sample_work_urls: string[];
  success_metrics: any;
  typical_results: string[];
  client_testimonials: any;
  consultation_required: boolean;
  consultation_duration: number;
  communication_channels: string[];
  faqs: any;
  booking_url: string;
  calendar_url: string;
  lead_time_days: number;
  max_concurrent_clients: number;
  current_clients: number;
  waitlist_available: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
  views_count: number;
  inquiries_count: number;
  bookings_count: number;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
  display_order: number;
  is_active: boolean;
  is_accepting_clients: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    fetchServices();
    fetchNewInquiriesCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchNewInquiriesCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchQuery, categoryFilter]);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const fetchNewInquiriesCount = async () => {
    const { count, error } = await supabase
      .from('service_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    if (error) {
      console.error('Error fetching new inquiries count:', error);
    } else {
      setNewInquiriesCount(count || 0);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((service) => service.category === categoryFilter);
    }

    setFilteredServices(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      alert('Error deleting service');
      console.error(error);
    } else {
      fetchServices();
    }
  };

  const handleDuplicate = async (service: Service) => {
    const duplicate = {
      ...service,
      id: undefined,
      name: `${service.name} (Copy)`,
      slug: `${service.slug}-copy-${Date.now()}`,
      created_at: undefined,
      updated_at: undefined,
    };

    const { error } = await supabase.from('services').insert(duplicate);

    if (error) {
      alert('Error duplicating service');
      console.error(error);
    } else {
      fetchServices();
    }
  };

  const toggleActive = async (service: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id);

    if (error) {
      alert('Error updating service');
      console.error(error);
    } else {
      fetchServices();
    }
  };

  const toggleFeatured = async (service: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ is_featured: !service.is_featured })
      .eq('id', service.id);

    if (error) {
      alert('Error updating service');
      console.error(error);
    } else {
      fetchServices();
    }
  };

  const toggleAcceptingClients = async (service: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ is_accepting_clients: !service.is_accepting_clients })
      .eq('id', service.id);

    if (error) {
      alert('Error updating service');
      console.error(error);
    } else {
      fetchServices();
    }
  };

  const stats = {
    total: services.length,
    active: services.filter((s) => s.is_active).length,
    featured: services.filter((s) => s.is_featured).length,
    accepting: services.filter((s) => s.is_accepting_clients).length,
  };

  const categories = ['Web Development', 'Mobile Apps', 'Consulting', 'Training'];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Services Management</h1>
            <p className="text-gray-600">Manage your portfolio services and offerings</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/services/inquiries"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-3 group"
            >
              {newInquiriesCount > 0 && (
                <span className="bg-linear-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-6 h-6 px-2 flex items-center justify-center shadow-lg shadow-red-500/50 ring-2 ring-white animate-bounce">
                  {newInquiriesCount > 99 ? '99+' : newInquiriesCount}
                </span>
              )}
              📩 View Inquiries
            </a>
            <button
              onClick={() => {
                setEditingService(null);
                setShowModal(true);
              }}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              + Add New Service
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total Services</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-green-700 mt-1">Active</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{stats.featured}</div>
            <div className="text-sm text-blue-700 mt-1">Featured</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">{stats.accepting}</div>
            <div className="text-sm text-purple-700 mt-1">Accepting Clients</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={fetchServices}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600 text-lg">No services found</p>
          <button
            onClick={() => {
              setEditingService(null);
              setShowModal(true);
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => {
                setEditingService(service);
                setShowModal(true);
              }}
              onDelete={() => handleDelete(service.id)}
              onDuplicate={() => handleDuplicate(service)}
              onToggleActive={() => toggleActive(service)}
              onToggleFeatured={() => toggleFeatured(service)}
              onToggleAccepting={() => toggleAcceptingClients(service)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowModal(false);
            setEditingService(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditingService(null);
            fetchServices();
          }}
        />
      )}
    </div>
  );
}

// Service Card Component
function ServiceCard({
  service,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
  onToggleFeatured,
  onToggleAccepting,
}: {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
  onToggleAccepting: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex gap-6 p-6">
        {/* Icon & Image */}
        <div className="shrink-0">
          <div
            className="w-24 h-24 rounded-xl flex items-center justify-center text-4xl mb-3"
            style={{ backgroundColor: `${service.color}30` }}
          >
            {service.icon}
          </div>
          {service.featured_image_url && (
            <div className="w-24 h-16 relative rounded-lg overflow-hidden">
              <Image
                src={service.featured_image_url}
                alt={service.name}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                {/* Badges */}
                <div className="flex gap-2">
                  {service.is_featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                      ⭐ Featured
                    </span>
                  )}
                  {service.is_popular && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded">
                      🔥 Popular
                    </span>
                  )}
                  {service.is_new && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                      ✨ New
                    </span>
                  )}
                  {!service.is_active && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded">
                      Inactive
                    </span>
                  )}
                  {!service.is_accepting_clients && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                      Not Accepting
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{service.tagline}</p>
              <p className="text-sm text-gray-700 line-clamp-2">{service.description}</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-semibold text-blue-600">{service.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-semibold capitalize">{service.service_type}</span>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <span className="ml-2 font-semibold text-green-600">
                ${service.base_price.toLocaleString()} {service.price_unit}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-semibold">{service.estimated_duration}</span>
            </div>
          </div>

          {/* Technologies */}
          {service.technologies && service.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {service.technologies.slice(0, 6).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
              {service.technologies.length > 6 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{service.technologies.length - 6} more
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 text-sm text-gray-600 mb-4">
            <div>👁️ {service.views_count} views</div>
            <div>📩 {service.inquiries_count} inquiries</div>
            <div>📅 {service.bookings_count} bookings</div>
            {service.current_clients > 0 && (
              <div>👥 {service.current_clients} current clients</div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              ✏️ Edit
            </button>
            <button
              onClick={onToggleActive}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                service.is_active
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {service.is_active ? '👁️ Deactivate' : '✅ Activate'}
            </button>
            <button
              onClick={onToggleFeatured}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                service.is_featured
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {service.is_featured ? '⭐ Unfeatured' : '⭐ Feature'}
            </button>
            <button
              onClick={onToggleAccepting}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                service.is_accepting_clients
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {service.is_accepting_clients ? '🚫 Stop Accepting' : '✅ Accept Clients'}
            </button>
            <button
              onClick={onDuplicate}
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-semibold"
            >
              📋 Duplicate
            </button>
            <a
              href={`/services/${service.slug}`}
              target="_blank"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
            >
              🔗 View
            </a>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Service Modal Component
function ServiceModal({
  service,
  onClose,
  onSave,
}: {
  service: Service | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Service>>(
    service || {
      name: '',
      slug: '',
      tagline: '',
      description: '',
      full_description: '',
      icon: '💼',
      color: '#3B82F6',
      featured_image_url: '',
      gallery_images: [],
      category: 'Web Development',
      subcategories: [],
      service_type: 'project',
      base_price: 0,
      price_currency: 'USD',
      price_unit: 'per project',
      pricing_tiers: [],
      is_price_negotiable: true,
      estimated_duration: '',
      duration_unit: 'weeks',
      min_duration: 0,
      max_duration: 0,
      is_available: true,
      availability_status: 'available',
      key_features: [],
      deliverables: [],
      included_services: [],
      excluded_services: [],
      requirements: [],
      technologies: [],
      tools: [],
      methodologies: [],
      languages: [],
      process_steps: [],
      portfolio_project_ids: [],
      case_study_urls: [],
      demo_url: '',
      github_repo_url: '',
      sample_work_urls: [],
      success_metrics: {},
      typical_results: [],
      client_testimonials: [],
      consultation_required: false,
      consultation_duration: 30,
      communication_channels: [],
      faqs: [],
      booking_url: '',
      calendar_url: '',
      lead_time_days: 0,
      max_concurrent_clients: 0,
      current_clients: 0,
      waitlist_available: false,
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      cta_primary_text: 'Get Started',
      cta_primary_url: '/contact',
      cta_secondary_text: 'Schedule Consultation',
      cta_secondary_url: '/book-consultation',
      views_count: 0,
      inquiries_count: 0,
      bookings_count: 0,
      is_featured: false,
      is_popular: false,
      is_new: false,
      display_order: 0,
      is_active: true,
      is_accepting_clients: true,
    }
  );

  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (service) {
        // Update
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', service.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from('services').insert(formData);

        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service. Please check the console.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const parseArray = (text: string): string[] => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const parseCommaArray = (text: string): string[] => {
    return text
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'process', label: 'Process', icon: '🔄' },
    { id: 'portfolio', label: 'Portfolio', icon: '🎨' },
    { id: 'booking', label: 'Booking', icon: '📅' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        updateField('name', e.target.value);
                        if (!service) {
                          updateField('slug', generateSlug(e.target.value));
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Web Development"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="web-development"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: /services/{formData.slug}
                    </p>
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Build Modern, Scalable Web Applications"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description for cards and previews..."
                  ></textarea>
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    value={formData.full_description}
                    onChange={(e) => updateField('full_description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed description for service page..."
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => updateField('icon', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-3xl text-center"
                      placeholder="💼"
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand Color
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => updateField('color', e.target.value)}
                      className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Apps">Mobile Apps</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image_url}
                    onChange={(e) => updateField('featured_image_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Subcategories */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subcategories (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.subcategories?.join(', ')}
                    onChange={(e) =>
                      updateField('subcategories', parseCommaArray(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Frontend, Backend, Full-Stack"
                  />
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies?.join(', ')}
                    onChange={(e) =>
                      updateField('technologies', parseCommaArray(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Next.js, React, TypeScript, Node.js"
                  />
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => updateField('service_type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="project">Project-Based</option>
                      <option value="hourly">Hourly</option>
                      <option value="retainer">Retainer</option>
                      <option value="package">Package</option>
                    </select>
                  </div>

                  {/* Base Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Base Price
                    </label>
                    <input
                      type="number"
                      value={formData.base_price}
                      onChange={(e) => updateField('base_price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="5000"
                    />
                  </div>

                  {/* Price Unit */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price Unit
                    </label>
                    <input
                      type="text"
                      value={formData.price_unit}
                      onChange={(e) => updateField('price_unit', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="per project"
                    />
                  </div>
                </div>

                {/* Pricing Tiers */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pricing Tiers (JSON)
                  </label>
                  <textarea
                    value={JSON.stringify(formData.pricing_tiers, null, 2)}
                    onChange={(e) => {
                      try {
                        updateField('pricing_tiers', JSON.parse(e.target.value));
                      } catch (err) {
                        // Invalid JSON, ignore
                      }
                    }}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder='[{"name": "Starter", "price": 5000, "features": ["Feature 1", "Feature 2"]}]'
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: [&#123;"name": "Tier Name", "price": 5000, "features": ["Feature 1"]&#125;]
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_price_negotiable}
                      onChange={(e) => updateField('is_price_negotiable', e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-semibold">Price Negotiable</span>
                  </label>
                </div>

                {/* Duration */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={formData.estimated_duration}
                      onChange={(e) => updateField('estimated_duration', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="4-12 weeks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Min Duration (number)
                    </label>
                    <input
                      type="number"
                      value={formData.min_duration}
                      onChange={(e) => updateField('min_duration', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Duration (number)
                    </label>
                    <input
                      type="number"
                      value={formData.max_duration}
                      onChange={(e) => updateField('max_duration', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Key Features */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Key Features (one per line)
                  </label>
                  <textarea
                    value={formData.key_features?.join('\n')}
                    onChange={(e) => updateField('key_features', parseArray(e.target.value))}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Modern tech stack&#10;Responsive design&#10;SEO optimized"
                  ></textarea>
                </div>

                {/* Deliverables */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deliverables (one per line)
                  </label>
                  <textarea
                    value={formData.deliverables?.join('\n')}
                    onChange={(e) => updateField('deliverables', parseArray(e.target.value))}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Fully functional application&#10;Source code&#10;Documentation"
                  ></textarea>
                </div>

                {/* Included Services */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What's Included (one per line)
                  </label>
                  <textarea
                    value={formData.included_services?.join('\n')}
                    onChange={(e) =>
                      updateField('included_services', parseArray(e.target.value))
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Frontend development&#10;Backend API&#10;Database setup"
                  ></textarea>
                </div>

                {/* Excluded Services */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What's NOT Included (one per line)
                  </label>
                  <textarea
                    value={formData.excluded_services?.join('\n')}
                    onChange={(e) =>
                      updateField('excluded_services', parseArray(e.target.value))
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Content writing&#10;Hosting fees&#10;Domain registration"
                  ></textarea>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Requirements from Client (one per line)
                  </label>
                  <textarea
                    value={formData.requirements?.join('\n')}
                    onChange={(e) => updateField('requirements', parseArray(e.target.value))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Clear project requirements&#10;Brand assets&#10;API access"
                  ></textarea>
                </div>

                {/* Typical Results */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Typical Results (one per line)
                  </label>
                  <textarea
                    value={formData.typical_results?.join('\n')}
                    onChange={(e) => updateField('typical_results', parseArray(e.target.value))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="50% faster load times&#10;3x more conversions&#10;99.9% uptime"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Process Tab */}
            {activeTab === 'process' && (
              <div className="space-y-6">
                {/* Process Steps */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Process Steps (JSON)
                  </label>
                  <textarea
                    value={JSON.stringify(formData.process_steps, null, 2)}
                    onChange={(e) => {
                      try {
                        updateField('process_steps', JSON.parse(e.target.value));
                      } catch (err) {
                        // Invalid JSON
                      }
                    }}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder='[{"step": 1, "title": "Discovery", "description": "Understanding requirements", "duration": "1 week"}]'
                  ></textarea>
                </div>

                {/* FAQs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    FAQs (JSON)
                  </label>
                  <textarea
                    value={JSON.stringify(formData.faqs, null, 2)}
                    onChange={(e) => {
                      try {
                        updateField('faqs', JSON.parse(e.target.value));
                      } catch (err) {
                        // Invalid JSON
                      }
                    }}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder='[{"question": "How long does it take?", "answer": "Typically 4-12 weeks"}]'
                  ></textarea>
                </div>

                {/* Tools & Methodologies */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tools (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tools?.join(', ')}
                      onChange={(e) => updateField('tools', parseCommaArray(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="VS Code, Git, Figma"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Methodologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.methodologies?.join(', ')}
                      onChange={(e) =>
                        updateField('methodologies', parseCommaArray(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Agile, Scrum, TDD"
                    />
                  </div>
                </div>

                {/* Consultation */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.consultation_required}
                        onChange={(e) =>
                          updateField('consultation_required', e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-semibold">Consultation Required</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Consultation Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.consultation_duration}
                      onChange={(e) =>
                        updateField('consultation_duration', parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Communication Channels */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Communication Channels (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.communication_channels?.join(', ')}
                    onChange={(e) =>
                      updateField('communication_channels', parseCommaArray(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Slack, Email, Zoom, Discord"
                  />
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* Case Study URLs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Case Study URLs (one per line)
                  </label>
                  <textarea
                    value={formData.case_study_urls?.join('\n')}
                    onChange={(e) => updateField('case_study_urls', parseArray(e.target.value))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/case-study-1"
                  ></textarea>
                </div>

                {/* Demo & GitHub */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Demo URL
                    </label>
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => updateField('demo_url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://demo.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      GitHub Repository
                    </label>
                    <input
                      type="url"
                      value={formData.github_repo_url}
                      onChange={(e) => updateField('github_repo_url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                {/* Sample Work URLs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sample Work URLs (one per line)
                  </label>
                  <textarea
                    value={formData.sample_work_urls?.join('\n')}
                    onChange={(e) => updateField('sample_work_urls', parseArray(e.target.value))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/work-1"
                  ></textarea>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gallery Images (one URL per line)
                  </label>
                  <textarea
                    value={formData.gallery_images?.join('\n')}
                    onChange={(e) => updateField('gallery_images', parseArray(e.target.value))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://images.unsplash.com/..."
                  ></textarea>
                </div>
              </div>
            )}

            {/* Booking Tab */}
            {activeTab === 'booking' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Booking URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Booking URL
                    </label>
                    <input
                      type="url"
                      value={formData.booking_url}
                      onChange={(e) => updateField('booking_url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://book.example.com"
                    />
                  </div>

                  {/* Calendar URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Calendar URL (Calendly, etc.)
                    </label>
                    <input
                      type="url"
                      value={formData.calendar_url}
                      onChange={(e) => updateField('calendar_url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://calendly.com/username"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Lead Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lead Time (days)
                    </label>
                    <input
                      type="number"
                      value={formData.lead_time_days}
                      onChange={(e) => updateField('lead_time_days', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Max Concurrent Clients */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Concurrent Clients
                    </label>
                    <input
                      type="number"
                      value={formData.max_concurrent_clients}
                      onChange={(e) =>
                        updateField('max_concurrent_clients', parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Current Clients */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Clients
                    </label>
                    <input
                      type="number"
                      value={formData.current_clients}
                      onChange={(e) => updateField('current_clients', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Availability Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <select
                    value={formData.availability_status}
                    onChange={(e) => updateField('availability_status', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="limited">Limited Availability</option>
                    <option value="booked">Fully Booked</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.waitlist_available}
                      onChange={(e) => updateField('waitlist_available', e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-semibold">Waitlist Available</span>
                  </label>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meta Title (60 characters)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => updateField('meta_title', e.target.value)}
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Professional Web Development Services | Next.js & React"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.meta_title?.length || 0}/60 characters
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meta Description (160 characters)
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => updateField('meta_description', e.target.value)}
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Build modern, scalable web applications with Next.js, React, and TypeScript..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.meta_description?.length || 0}/160 characters
                  </p>
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meta Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_keywords?.join(', ')}
                    onChange={(e) =>
                      updateField('meta_keywords', parseCommaArray(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="web development, nextjs, react, typescript"
                  />
                </div>

                {/* CTAs */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={formData.cta_primary_text}
                      onChange={(e) => updateField('cta_primary_text', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Get Started"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary CTA URL
                    </label>
                    <input
                      type="text"
                      value={formData.cta_primary_url}
                      onChange={(e) => updateField('cta_primary_url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="/contact"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Secondary CTA Text
                    </label>
                    <input
                      type="text"
                      value={formData.cta_secondary_text}
                      onChange={(e) => updateField('cta_secondary_text', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Schedule Consultation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Secondary CTA URL
                    </label>
                    <input
                      type="text"
                      value={formData.cta_secondary_url}
                      onChange={(e) => updateField('cta_secondary_url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="/book-consultation"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Display Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => updateField('display_order', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                {/* Status Toggles */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => updateField('is_active', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-semibold">Active (visible to public)</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_accepting_clients}
                        onChange={(e) => updateField('is_accepting_clients', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-semibold">Accepting Clients</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => updateField('is_featured', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-semibold">Featured Service</span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_popular}
                        onChange={(e) => updateField('is_popular', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-semibold">Mark as Popular</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_new}
                        onChange={(e) => updateField('is_new', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-semibold">Mark as New</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_available}
                        onChange={(e) => updateField('is_available', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-semibold">Currently Available</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
