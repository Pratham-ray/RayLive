import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InquiryResponse } from '../types/inquiry';
import { PropertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Inbox, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  Filter,
  ShieldCheck,
  Building2,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { Property } from '../types/property';

interface AgentInboxPageProps {
  onOpenAIBroker: (property?: Property) => void;
}

export const AgentInboxPage: React.FC<AgentInboxPageProps> = ({ onOpenAIBroker }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState<InquiryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CONTACTED' | 'COMPLETED'>('ALL');

  useEffect(() => {
    PropertyAPI.getInquiries().then(data => {
      // If user is logged in, show all or filtered inquiries
      if (data && data.length > 0) {
        setInquiries(data);
      } else {
        // Seed realistic demo leads for the agent/owner to test immediately
        const demoLeads: InquiryResponse[] = [
          {
            id: 101,
            propertyId: 1,
            propertyTitle: "Prestige Lakeside Luxury Residences",
            propertyCity: "Bangalore",
            propertyFormattedPrice: "₹1.85 Cr",
            propertyImageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
            name: "Rahul Verma",
            email: "rahul.verma@gmail.com",
            phone: "+91 98450 12345",
            message: "Morning (9 AM - 12 PM) - Looking to visit with family this Saturday. Interested in loan assistance.",
            preferredTourDate: "2026-11-28",
            status: "CONFIRMED",
            createdAt: new Date().toISOString()
          },
          {
            id: 102,
            propertyId: 2,
            propertyTitle: "Skyline Sea-Facing Penthouse",
            propertyCity: "Mumbai",
            propertyFormattedPrice: "₹6.50 Cr",
            propertyImageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80",
            name: "Sneha Kapoor",
            email: "sneha.k@outlook.com",
            phone: "+91 98201 67890",
            message: "Evening (4 PM - 7 PM) - High-net-worth investor looking for floor plans and private elevator demo.",
            preferredTourDate: "2026-11-29",
            status: "CONTACTED",
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 103,
            propertyId: 3,
            propertyTitle: "Contemporary Minimalist 2 BHK Flat",
            propertyCity: "Bangalore",
            propertyFormattedPrice: "₹48,000/mo",
            propertyImageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
            name: "Anand Ranganathan",
            email: "anand.r@techcorp.in",
            phone: "+91 97412 34567",
            message: "Afternoon (12 PM - 4 PM) - Tech lead relocating to Bangalore. Ready for immediate move-in.",
            preferredTourDate: "2026-12-01",
            status: "CONFIRMED",
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        setInquiries(demoLeads);
      }
      setLoading(false);
    });
  }, []);

  const updateLeadStatus = (id: number, newStatus: string) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (statusFilter === 'ALL') return true;
    return inq.status?.toUpperCase() === statusFilter;
  });

  const confirmedCount = inquiries.filter(i => i.status === 'CONFIRMED').length;
  const contactedCount = inquiries.filter(i => i.status === 'CONTACTED').length;
  const completedCount = inquiries.filter(i => i.status === 'COMPLETED').length;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to listings</span>
          </Link>

          <button
            onClick={() => onOpenAIBroker()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Ask RayBroker Lead Insights</span>
          </button>
        </div>

        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-navy-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
                  <Inbox className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Owner & Verified Broker CRM
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Tour Inquiries & Lead Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Review visitor requests, verify appointment times, and directly communicate with prospective home buyers.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-navy-900/80 p-3 rounded-2xl border border-navy-800 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-400">Total Leads</p>
                <p className="text-xl font-black text-white mt-0.5">{inquiries.length}</p>
              </div>
              <div className="bg-navy-900/80 p-3 rounded-2xl border border-navy-800 text-center">
                <p className="text-[10px] font-bold uppercase text-emerald-400">Confirmed</p>
                <p className="text-xl font-black text-emerald-400 mt-0.5">{confirmedCount}</p>
              </div>
              <div className="bg-navy-900/80 p-3 rounded-2xl border border-navy-800 text-center">
                <p className="text-[10px] font-bold uppercase text-amber-400">Contacted</p>
                <p className="text-xl font-black text-amber-400 mt-0.5">{contactedCount}</p>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-navy-800/80">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>
            {(['ALL', 'CONFIRMED', 'CONTACTED', 'COMPLETED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-gold-500 text-navy-950 shadow-sm'
                    : 'bg-navy-800/80 text-slate-300 hover:text-white hover:bg-navy-800'
                }`}
              >
                {tab === 'ALL' ? 'All Leads' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Inquiries Content */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-sm font-semibold text-slate-500">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">No leads in this status</h3>
            <p className="text-xs text-slate-500 mt-1">Switch filter to "All Leads" to view incoming inquiries.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map(lead => (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Property & Lead Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <img
                    src={lead.propertyImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'}
                    alt={lead.propertyTitle}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        lead.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lead.status === 'CONTACTED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {lead.status}
                      </span>
                      <span className="text-xs font-black text-navy-950">
                        {lead.propertyFormattedPrice}
                      </span>
                    </div>

                    <Link
                      to={`/property/${lead.propertyId}`}
                      className="font-bold text-sm text-slate-900 hover:text-amber-600 transition-colors line-clamp-1"
                    >
                      {lead.propertyTitle}
                    </Link>

                    {/* Buyer Contact Pill */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                      <span className="font-bold text-navy-950">Lead: {lead.name}</span>
                      <span className="text-slate-300">•</span>
                      <span>{lead.email}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-medium">{lead.phone}</span>
                    </div>

                    {lead.message && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-2 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{lead.message}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Scheduled Appointment Info */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 min-w-[210px]">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Requested Tour Date</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy-950">
                    <Calendar className="w-4 h-4 text-gold-600" />
                    <span>{lead.preferredTourDate || 'Flexible Visit'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Physical Guided Tour</span>
                  </div>
                </div>

                {/* Actions & Status Dropdown */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 justify-end min-w-[170px]">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${lead.phone}`}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      title="Call Buyer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`mailto:${lead.email}`}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      title="Email Buyer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>

                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-navy-950 focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
                    <option value="CONFIRMED">Status: Confirmed</option>
                    <option value="CONTACTED">Status: Contacted</option>
                    <option value="COMPLETED">Status: Completed</option>
                    <option value="CANCELLED">Status: Cancelled</option>
                  </select>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
