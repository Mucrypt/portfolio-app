'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ServiceInquiry {
  id: string;
  service_id: string;
  service_name: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  subject?: string;
  message?: string;
  budget_range?: string;
  timeline?: string;
  project_description?: string;
  specific_requirements?: string;
  preferred_start_date?: string;
  urgency?: string;
  status: string;
  notes?: string;
  responded_at?: string;
  created_at: string;
  updated_at?: string;
}

interface Service {
  id: string;
  name: string;
}

export default function ServiceInquiriesPage() {
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ServiceInquiry | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  // Form state for response
  const [adminNotes, setAdminNotes] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchInquiries();
    fetchServices();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_inquiries')
        .select(`
          *,
          services (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map((item: any) => ({
        ...item,
        service_name: item.services?.name || 'Unknown Service'
      })) || [];

      setInquiries(formattedData);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      alert('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Filter inquiries based on search and filters
  const filteredInquiries = inquiries.filter((inquiry: ServiceInquiry) => {
    const matchesSearch = searchQuery === '' || 
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService = serviceFilter === 'all' || inquiry.service_id === serviceFilter;
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || inquiry.urgency === urgencyFilter;

    return matchesSearch && matchesService && matchesStatus && matchesUrgency;
  });

  // Stats calculations
  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i: ServiceInquiry) => i.status === 'new').length,
    contacted: inquiries.filter((i: ServiceInquiry) => i.status === 'contacted').length,
    qualified: inquiries.filter((i: ServiceInquiry) => i.status === 'qualified').length,
    proposalSent: inquiries.filter((i: ServiceInquiry) => i.status === 'proposal_sent').length,
    accepted: inquiries.filter((i: ServiceInquiry) => i.status === 'accepted').length,
  };

  const openInquiryModal = async (inquiry: ServiceInquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.notes || '');
    setAdminResponse('');
    setNewStatus(inquiry.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInquiry(null);
    setAdminNotes('');
    setAdminResponse('');
  };

  const updateInquiry = async () => {
    if (!selectedInquiry) return;

    try {
      const updates: any = {
        notes: adminNotes,
        status: newStatus,
      };

      // If changing status to contacted/responded for first time
      if (!selectedInquiry.responded_at && ['contacted', 'qualified', 'proposal_sent', 'accepted'].includes(newStatus)) {
        updates.responded_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('service_inquiries')
        .update(updates)
        .eq('id', selectedInquiry.id);

      if (error) throw error;

      alert('Inquiry updated successfully!');
      fetchInquiries();
      closeModal();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update inquiry');
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('service_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Inquiry deleted successfully');
      fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-yellow-100 text-yellow-800';
      case 'proposal_sent': return 'bg-indigo-100 text-indigo-800';
      case 'negotiating': return 'bg-orange-100 text-orange-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'spam': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    alert('Email copied to clipboard!');
  };

  const composeEmail = (inquiry: ServiceInquiry) => {
    const subject = `Re: ${inquiry.service_name} - ${inquiry.message?.substring(0, 30)}...`;
    const body = adminResponse || `Hi ${inquiry.name},\n\nThank you for your interest in our ${inquiry.service_name} service.\n\n`;
    window.open(`mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading inquiries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Inquiries</h1>
        <p className="text-gray-600">Manage and respond to service inquiry submissions</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Inquiries</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <div className="text-sm text-blue-600 mb-1">New</div>
          <div className="text-3xl font-bold text-blue-900">{stats.new}</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200">
          <div className="text-sm text-purple-600 mb-1">Contacted</div>
          <div className="text-3xl font-bold text-purple-900">{stats.contacted}</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
          <div className="text-sm text-yellow-600 mb-1">Qualified</div>
          <div className="text-3xl font-bold text-yellow-900">{stats.qualified}</div>
        </div>
        <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-200">
          <div className="text-sm text-indigo-600 mb-1">Proposal Sent</div>
          <div className="text-3xl font-bold text-indigo-900">{stats.proposalSent}</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
          <div className="text-sm text-green-600 mb-1">Accepted</div>
          <div className="text-3xl font-bold text-green-900">{stats.accepted}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Name, email, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Service Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Services</option>
              {services.map((service: Service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="negotiating">Negotiating</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="spam">Spam</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Urgency Levels</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setSearchQuery('');
              setServiceFilter('all');
              setStatusFilter('all');
              setUrgencyFilter('all');
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={fetchInquiries}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Inquiries Found</h3>
            <p className="text-gray-600">
              {searchQuery || serviceFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No service inquiries have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInquiries.map((inquiry: ServiceInquiry) => (
                  <tr
                    key={inquiry.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openInquiryModal(inquiry)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                      <div className="text-sm text-gray-500">{inquiry.email}</div>
                      {inquiry.company && (
                        <div className="text-xs text-gray-400">{inquiry.company}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.service_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.budget_range || 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.timeline || 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inquiry.urgency ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(inquiry.urgency)}`}>
                          {inquiry.urgency}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(inquiry.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInquiryModal(inquiry);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteInquiry(inquiry.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedInquiry?.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Status and Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInquiry?.status || 'new')}`}>
                  {selectedInquiry?.status.replace('_', ' ')}
                </span>
                {selectedInquiry?.urgency && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(selectedInquiry.urgency)}`}>
                    {selectedInquiry.urgency} priority
                  </span>
                )}
                {selectedInquiry?.responded_at && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Responded
                  </span>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <p className="text-gray-900 font-medium">{selectedInquiry?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-medium">{selectedInquiry?.email}</p>
                      <button
                        onClick={() => selectedInquiry?.email && copyEmailToClipboard(selectedInquiry.email)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="Copy email"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  {selectedInquiry?.phone && (
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="text-gray-900 font-medium">{selectedInquiry.phone}</p>
                    </div>
                  )}
                  {selectedInquiry?.company && (
                    <div>
                      <label className="text-sm text-gray-600">Company</label>
                      <p className="text-gray-900 font-medium">{selectedInquiry.company}</p>
                    </div>
                  )}
                  {selectedInquiry?.website && (
                    <div>
                      <label className="text-sm text-gray-600">Website</label>
                      <a
                        href={selectedInquiry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {selectedInquiry.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Service & Project Details */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service & Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-600">Service</label>
                    <p className="text-gray-900 font-medium">{selectedInquiry?.service_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Budget Range</label>
                    <p className="text-gray-900 font-medium">{selectedInquiry?.budget_range || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Timeline</label>
                    <p className="text-gray-900 font-medium">{selectedInquiry?.timeline || 'Not specified'}</p>
                  </div>
                  {selectedInquiry?.preferred_start_date && (
                    <div>
                      <label className="text-sm text-gray-600">Preferred Start Date</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedInquiry.preferred_start_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                {selectedInquiry?.message && (
                  <div>
                    <label className="text-sm text-gray-600">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                )}
                {selectedInquiry?.specific_requirements && (
                  <div className="mt-3">
                    <label className="text-sm text-gray-600">Specific Requirements</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.specific_requirements}</p>
                  </div>
                )}
              </div>

              {/* Submission Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Submission Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Submitted At</label>
                    <p className="text-gray-900 font-medium">{selectedInquiry?.created_at && formatDate(selectedInquiry.created_at)}</p>
                  </div>
                  {selectedInquiry?.responded_at && (
                    <div>
                      <label className="text-sm text-gray-600">Responded At</label>
                      <p className="text-gray-900 font-medium">{formatDate(selectedInquiry.responded_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Internal)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={6}
                  placeholder="Add internal notes about this inquiry...\n\nYou can track:\n- Client communication history\n- Meeting notes\n- Proposal details\n- Follow-up actions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="accepted">Accepted (Won)</option>
                  <option value="declined">Declined (Lost)</option>
                  <option value="spam">Spam</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateInquiry}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
