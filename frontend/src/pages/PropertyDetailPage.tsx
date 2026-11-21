import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Property } from '../types/property';
import { ValuationData } from '../types/ai';
import { PropertyAPI } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Phone, 
  Mail, 
  Share2, 
  Heart, 
  CheckCircle2, 
  Calculator,
  ArrowLeft,
  Clock,
  Car,
  Home,
  Check
} from 'lucide-react';

interface PropertyDetailPageProps {
  onOpenAIBroker: (property?: Property) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ onOpenAIBroker }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // EMI Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // Tour Booking Form State
  const { user } = useAuth();
  const [tourName, setTourName] = useState(user?.name || '');
  const [tourEmail, setTourEmail] = useState(user?.email || '');
  const [tourPhone, setTourPhone] = useState(user?.phone || '');
  const [tourDate, setTourDate] = useState('');
  const [tourTimeSlot, setTourTimeSlot] = useState('Morning (9 AM - 12 PM)');
  const [tourMessage, setTourMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [tourSubmitted, setTourSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      if (!tourName) setTourName(user.name);
      if (!tourEmail) setTourEmail(user.email);
      if (!tourPhone && user.phone) setTourPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      PropertyAPI.getPropertyById(Number(id)).then((p) => {
        if (p) {
          setProperty(p);
          PropertyAPI.getValuation(p).then(setValuation);
        }
      });
    }
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  const isSaved = isFavorite(property.id);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/property/${id}`)}`);
      return;
    }
    toggleFavorite(property.id);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // EMI Calculations
  const propertyPrice = property.price || 0;
  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPayment;
  const monthlyRate = (interestRate / 12) / 100;
  const totalMonths = tenureYears * 12;
  const emi = loanAmount > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  const handleBookTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/property/${id}`)}`);
      return;
    }
    if (!property) return;

    setBookingLoading(true);
    try {
      await PropertyAPI.createInquiry({
        propertyId: property.id,
        name: tourName,
        email: tourEmail,
        phone: tourPhone,
        preferredTourDate: tourDate,
        message: `${tourTimeSlot} - ${tourMessage || 'Standard property tour request'}`
      }, property);
      setTourSubmitted(true);
    } catch (err) {
      console.error('Failed to book tour', err);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all properties</span>
          </Link>
        </div>

        {/* Title & Top Badges Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-navy-900 text-gold-400">
                {property.listingType === 'BUY' ? 'For Sale' : property.listingType === 'RENT' ? 'For Rent' : 'Commercial'}
              </span>
              {property.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  RERA Verified
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">
                ID: RAY-{property.id}109
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1">
              <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <span>{property.address || property.locality}, {property.city}, {property.state} {property.pincode}</span>
            </p>
          </div>

          {/* Price Tag & AI Valuation CTA */}
          <div className="flex flex-col md:items-end">
            <span className="text-3xl font-black text-navy-950">
              {property.formattedPrice}
            </span>
            {property.pricePerSqFt && (
              <span className="text-xs text-slate-500 font-medium mt-0.5">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')} / sq.ft
              </span>
            )}
            <button
              onClick={() => onOpenAIBroker(property)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ask RayBroker to evaluate this deal</span>
            </button>
            
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600'
                }`}
                title={isSaved ? "Remove from saved" : "Save property"}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                title={copied ? "Link copied!" : "Share property"}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          {/* Main Large Image */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 relative shadow-md">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[16/10] w-32 lg:w-full flex-shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-gold-500 ring-2 ring-gold-500/20' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div>
                <p className="text-xs text-slate-400 font-medium">Bedrooms</p>
                <p className="text-lg font-bold text-navy-950 flex items-center justify-center gap-1 mt-1">
                  <Bed className="w-4 h-4 text-gold-600" />
                  <span>{property.bedrooms ? `${property.bedrooms} BHK` : 'Studio/Office'}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Bathrooms</p>
                <p className="text-lg font-bold text-navy-950 flex items-center justify-center gap-1 mt-1">
                  <Bath className="w-4 h-4 text-gold-600" />
                  <span>{property.bathrooms || 1} Baths</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Super Area</p>
                <p className="text-lg font-bold text-navy-950 flex items-center justify-center gap-1 mt-1">
                  <Maximize2 className="w-4 h-4 text-gold-600" />
                  <span>{property.areaSqFt} sq.ft</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Furnishing</p>
                <p className="text-lg font-bold text-navy-950 flex items-center justify-center gap-1 mt-1">
                  <Home className="w-4 h-4 text-gold-600" />
                  <span>{property.furnishingStatus || 'Unfurnished'}</span>
                </p>
              </div>
            </div>

            {/* AI Fair Price Scorecard Banner */}
            {valuation && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-900 text-white border border-navy-800 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <div className="flex items-center gap-2 text-gold-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>RayBroker AI Valuation Scorecard</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {valuation.confidenceLevel} Confidence
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div className="p-3 rounded-xl bg-navy-850">
                    <p className="text-[11px] text-slate-400">Micro-Market Benchmark</p>
                    <p className="text-xl font-bold text-white mt-1">₹{valuation.estimatedFairPrice.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-400">₹{valuation.estimatedPricePerSqFt.toLocaleString('en-IN')}/sq.ft</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-850">
                    <p className="text-[11px] text-slate-400">Fair Price Range</p>
                    <p className="text-base font-bold text-slate-200 mt-1">
                      ₹{Math.round(valuation.priceRangeLow / 100000)}L - ₹{Math.round(valuation.priceRangeHigh / 100000)}L
                    </p>
                    <p className="text-[10px] text-slate-400">±6% variance window</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-850">
                    <p className="text-[11px] text-slate-400">Estimated Rental Yield</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{valuation.estimatedRentalYieldPercentage}%</p>
                    <p className="text-[10px] text-slate-400">Annual gross yield</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {valuation.valuationSummary}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-navy-950">Property Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-navy-950">Features & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive EMI Calculator (If Buy) */}
            {property.listingType === 'BUY' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Calculator className="w-5 h-5 text-gold-600" />
                  <h3 className="text-lg font-bold text-navy-950">Home Loan & EMI Calculator</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Down Payment ({downPaymentPercent}%)</label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-gold-500"
                    />
                    <p className="text-xs font-bold text-slate-800 mt-1">₹{Math.round(downPayment).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Interest Rate ({interestRate}%)</label>
                    <input
                      type="range"
                      min="7.0"
                      max="12.0"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-gold-500"
                    />
                    <p className="text-xs font-bold text-slate-800 mt-1">{interestRate}% per annum</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tenure ({tenureYears} Years)</label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full accent-gold-500"
                    />
                    <p className="text-xs font-bold text-slate-800 mt-1">{tenureYears} Years</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500">Estimated Monthly EMI</span>
                    <h4 className="text-2xl font-black text-navy-950">₹{Math.round(emi).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/mo</span></h4>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>Principal Loan: ₹{Math.round(loanAmount).toLocaleString('en-IN')}</p>
                    <p>Total Interest: ₹{Math.round((emi * totalMonths) - loanAmount).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Agent Contact & Tour Booking */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Agent Profile Card */}
            {property.agent && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={property.agent.avatarUrl}
                    alt={property.agent.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-navy-950">{property.agent.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-500">{property.agent.agencyName}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                      ★ {property.agent.rating} Verified Broker
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Agent</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            )}

            {/* Tour Booking Form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-navy-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-600" />
                <span>Schedule a Physical Tour</span>
              </h3>

              {tourSubmitted ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">Site Visit Confirmed!</h4>
                    <p className="text-slate-600 mt-1">
                      Your visit for <strong>{tourDate} ({tourTimeSlot.split(' ')[0]})</strong> has been recorded.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      to="/bookings"
                      className="w-full py-2.5 rounded-xl bg-navy-950 text-gold-400 font-bold text-xs hover:bg-navy-900 transition-colors shadow-sm text-center"
                    >
                      View in My Bookings
                    </Link>
                    <button
                      type="button"
                      onClick={() => setTourSubmitted(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Book another visit
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookTour} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={tourName}
                      onChange={(e) => setTourName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={tourEmail}
                      onChange={(e) => setTourEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number (+91)</label>
                    <input
                      type="tel"
                      required
                      value={tourPhone}
                      onChange={(e) => setTourPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Preferred Time Window</label>
                    <select
                      value={tourTimeSlot}
                      onChange={(e) => setTourTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold-500 text-slate-700"
                    >
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Questions / Notes (Optional)</label>
                    <textarea
                      rows={2}
                      value={tourMessage}
                      onChange={(e) => setTourMessage(e.target.value)}
                      placeholder="e.g. Interested in floor plans or negotiation"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-gold-400 font-bold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {bookingLoading ? 'Scheduling...' : 'Request Free Site Visit'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
