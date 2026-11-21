import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InquiryResponse } from '../types/inquiry';
import { PropertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Compass, 
  Phone, 
  Mail,
  Lock,
  Building2
} from 'lucide-react';
import { Property } from '../types/property';

interface BookingsPageProps {
  onOpenAIBroker: (property?: Property) => void;
}

export const BookingsPage: React.FC<BookingsPageProps> = ({ onOpenAIBroker }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<InquiryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await PropertyAPI.getInquiries(user?.email);
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
    }
  }, [isAuthenticated, user?.email]);

  const handleCancelBooking = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this scheduled tour?')) {
      await PropertyAPI.cancelInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-navy-950 mb-2">Sign in to View Your Tours</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Manage your physical site visits, tour schedules, and direct communications with verified RERA agents.
          </p>
          <button
            onClick={() => navigate('/login?redirect=/bookings')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to explore listings</span>
          </Link>
          
          <button
            onClick={() => onOpenAIBroker()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Ask RayBroker Tour Questions</span>
          </button>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-navy-800 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Site Visits & Consultations
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            My Scheduled Tours
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track confirmed appointments, agent contact details, and tour status for your shortlisted properties.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-sm font-semibold text-slate-500">Loading your scheduled tours...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-inner">
              <Calendar className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-navy-950 mb-1">
              No Scheduled Tours Yet
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              When you find a home you like, use the "Schedule a Physical Tour" form on its detail page to book a free guided visit.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy-950 text-gold-400 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-navy-900 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Properties</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              {inquiries.length} {inquiries.length === 1 ? 'Tour Scheduled' : 'Tours Scheduled'}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Property Info & Image */}
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <img
                      src={inq.propertyImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                      alt={inq.propertyTitle}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                    />
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {inq.status || 'CONFIRMED'}
                        </span>
                        <span className="text-xs font-black text-navy-950">
                          {inq.propertyFormattedPrice}
                        </span>
                      </div>

                      <Link
                        to={`/property/${inq.propertyId}`}
                        className="font-bold text-sm text-slate-900 hover:text-amber-600 transition-colors line-clamp-1"
                      >
                        {inq.propertyTitle}
                      </Link>

                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                        <span>{inq.propertyCity}</span>
                      </div>

                      {inq.message && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5">
                          "{inq.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date & Time Badge */}
                  <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 min-w-[200px] text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-navy-950">
                      <Calendar className="w-4 h-4 text-gold-600" />
                      <span>{inq.preferredTourDate || 'Date to be confirmed'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Free Guided Site Visit</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 justify-end">
                    <Link
                      to={`/property/${inq.propertyId}`}
                      className="flex-1 sm:w-full text-center px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 text-white font-bold text-xs transition-colors"
                    >
                      View Property
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(inq.id)}
                      className="flex-1 sm:w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
