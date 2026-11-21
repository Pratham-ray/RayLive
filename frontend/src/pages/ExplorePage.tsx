import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Property, ListingType, PropertyType, SearchFilters } from '../types/property';
import { PropertyAPI } from '../services/api';
import { PropertyGrid } from '../components/PropertyGrid';
import { CITIES } from '../data/mockProperties';
import { 
  Filter, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Map as MapIcon, 
  Grid as GridIcon,
  Sparkles,
  Check
} from 'lucide-react';

interface ExplorePageProps {
  onOpenAIBroker: (property?: Property) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onOpenAIBroker }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [listingType, setListingType] = useState<ListingType>(
    (searchParams.get('type') as ListingType) || 'BUY'
  );
  const [city, setCity] = useState(searchParams.get('city') || 'All Cities');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>(
    (searchParams.get('propertyType') as PropertyType) || ''
  );
  const [bedrooms, setBedrooms] = useState<number | ''>(
    searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : ''
  );
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc' | 'popular'>('newest');

  useEffect(() => {
    fetchFilteredProperties();
  }, [listingType, city, propertyType, bedrooms, sortBy, searchParams]);

  const fetchFilteredProperties = async () => {
    setLoading(true);
    const filters: SearchFilters = {
      listingType,
      city,
      propertyType,
      bedrooms,
      sortBy
    };
    const results = await PropertyAPI.getProperties(filters);
    setProperties(results);
    setLoading(false);
  };

  const handleResetFilters = () => {
    setListingType('BUY');
    setCity('All Cities');
    setPropertyType('');
    setBedrooms('');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Explore Properties
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Showing verified real-estate across {city === 'All Cities' ? 'all prime locations in India' : city}
            </p>
          </div>

          {/* View Mode Toggle: Grid vs Map */}
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-navy-900 text-gold-400' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <GridIcon className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'map' ? 'bg-navy-900 text-gold-400' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
            </div>

            <button
              onClick={() => onOpenAIBroker()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-gold-500/20 to-amber-500/15 border border-gold-500/40 text-amber-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ask AI Broker</span>
            </button>
          </div>
        </div>

        {/* Main Layout: Filter Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-navy-950 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-gold-600" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-navy-900 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Listing Type Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Listing Type
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                {(['BUY', 'RENT', 'COMMERCIAL'] as ListingType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setListingType(t)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      listingType === t
                        ? 'bg-navy-900 text-gold-400 shadow-sm'
                        : 'text-slate-600 hover:text-navy-900'
                    }`}
                  >
                    {t === 'BUY' ? 'Buy' : t === 'RENT' ? 'Rent' : 'Comm'}
                  </button>
                ))}
              </div>
            </div>

            {/* City Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Property Category
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="VILLA">Independent Villa</option>
                <option value="PENTHOUSE">Luxury Penthouse</option>
                <option value="STUDIO">Studio Flat</option>
                <option value="COMMERCIAL_OFFICE">Commercial Office</option>
              </select>
            </div>

            {/* Bedrooms (BHK) */}
            {listingType !== 'COMMERCIAL' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bedrooms (BHK)
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {(['', 1, 2, 3, 4] as (number | '')[]).map((bhk) => (
                    <button
                      key={String(bhk)}
                      onClick={() => setBedrooms(bhk)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        bedrooms === bhk
                          ? 'bg-navy-900 border-navy-900 text-gold-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {bhk === '' ? 'Any' : `${bhk}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick AI Assist CTA in sidebar */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Need Custom Matching?
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Tell RayBroker your exact office commute, pet requirements, or budget constraints to get custom recommendations.
              </p>
              <button
                onClick={() => onOpenAIBroker()}
                className="w-full py-2 rounded-lg bg-navy-900 text-gold-400 text-xs font-bold hover:bg-navy-850 transition-colors shadow-2xs"
              >
                Chat with RayBroker
              </button>
            </div>

          </div>

          {/* Right Main Results Section */}
          <div className="lg:col-span-3">
            {viewMode === 'grid' ? (
              <PropertyGrid
                properties={properties}
                sortBy={sortBy}
                onSortChange={(val) => setSortBy(val as any)}
                onAskAIBroker={(p) => onOpenAIBroker(p)}
                onOpenFilterDrawer={() => setMobileFilterOpen(true)}
              />
            ) : (
              /* Map View Mock */
              <div className="space-y-4">
                <div className="h-[480px] bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-200 shadow-md flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Mock Map Markers for properties */}
                  <div className="relative z-10 w-full h-full p-8 flex flex-wrap items-center justify-center gap-6">
                    {properties.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onOpenAIBroker(p)}
                        className="bg-navy-950/90 text-white hover:bg-navy-900 border border-gold-500/50 hover:border-gold-400 px-3 py-2 rounded-xl text-xs font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-gold-400" />
                        <div className="text-left">
                          <p className="text-[10px] text-slate-300 font-normal">{p.locality}</p>
                          <p className="text-xs font-black text-gold-400">{p.formattedPrice}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-medium text-slate-800 shadow-md">
                    📍 Showing {properties.length} geocoded properties on map. Click any pin to evaluate!
                  </div>
                </div>

                {/* Sub-grid of properties */}
                <PropertyGrid
                  properties={properties}
                  sortBy={sortBy}
                  onSortChange={(val) => setSortBy(val as any)}
                  onAskAIBroker={(p) => onOpenAIBroker(p)}
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
