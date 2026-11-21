import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee, Sparkles, Lock } from 'lucide-react';
import { ListingType, PropertyType } from '../types/property';
import { CITIES } from '../data/mockProperties';
import { useAuth } from '../context/AuthContext';

interface HeroSearchProps {
  onAIBrokerClick: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onAIBrokerClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [listingType, setListingType] = useState<ListingType>('BUY');
  const [city, setCity] = useState('Bangalore');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [budget, setBudget] = useState<string>('');

  const handleTabClick = (type: ListingType) => {
    setListingType(type);
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/explore?type=${type}`)}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('type', listingType);
    if (city && city !== 'All Cities') params.set('city', city);
    if (propertyType) params.set('propertyType', propertyType);
    if (budget) params.set('maxPrice', budget);

    const targetUrl = `/explore?${params.toString()}`;

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    } else {
      navigate(targetUrl);
    }
  };

  const handleTagClick = (tag: string) => {
    const targetUrl = `/explore?search=${encodeURIComponent(tag)}`;
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    } else {
      navigate(targetUrl);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-navy-900 via-navy-850 to-navy-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Decorative backdrop elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        
        {/* Brand Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>India's Next-Gen Real Estate Marketplace & AI Broker</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Find Properties. Discover Deals. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-yellow-500">
            Live Better.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10">
          Discover verified homes, apartments, villas, and commercial spaces with real-time fair price benchmarks and 24/7 AI Broker intelligence.
        </p>

        {/* Search Engine Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 text-slate-800 text-left border border-slate-200">
          
          {/* Tabs: Buy / Rent / Commercial */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
            {(['BUY', 'RENT', 'COMMERCIAL'] as ListingType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTabClick(type)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  listingType === type
                    ? 'bg-navy-900 text-gold-400 shadow-md'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                {!isAuthenticated && <Lock className="w-3 h-3 opacity-60" />}
                <span>{type === 'BUY' ? 'Buy Property' : type === 'RENT' ? 'Rent House' : 'Commercial'}</span>
              </button>
            ))}

            <div className="ml-auto hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={onAIBrokerClick}
                className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Ask RayBroker
              </button>
            </div>
          </div>

          {/* Search Inputs Grid */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* City Selector */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                Location / City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-gold-600" />
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="VILLA">Independent Villa</option>
                <option value="PENTHOUSE">Luxury Penthouse</option>
                <option value="STUDIO">Studio Flat</option>
                <option value="COMMERCIAL_OFFICE">Commercial Office</option>
              </select>
            </div>

            {/* Budget Range */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-gold-600" />
                Max Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="">Any Budget</option>
                {listingType === 'RENT' ? (
                  <>
                    <option value="25000">Under ₹25,000/mo</option>
                    <option value="50000">Under ₹50,000/mo</option>
                    <option value="100000">Under ₹1,00,000/mo</option>
                  </>
                ) : (
                  <>
                    <option value="7500000">Under ₹75 Lakhs</option>
                    <option value="15000000">Under ₹1.5 Crore</option>
                    <option value="30000000">Under ₹3.0 Crore</option>
                    <option value="50000000">Under ₹5.0 Crore</option>
                  </>
                )}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-gold-500/25 transition-all transform active:scale-[0.98] cursor-pointer"
              >
                {!isAuthenticated && <Lock className="w-4 h-4 text-navy-950" />}
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search Properties</span>
              </button>
            </div>

          </form>

        </div>

        {/* Quick Tag Recommendations */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
          <span className="text-slate-400">Popular Searches:</span>
          {['Gated 3 BHK in Whitefield', 'Sea-Facing in Bandra', 'Rent under ₹50k', 'DLF Cyber City Offices'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 rounded-full bg-navy-800/80 hover:bg-navy-700 text-slate-200 border border-navy-700 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
