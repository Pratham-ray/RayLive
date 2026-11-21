import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSearch } from '../components/HeroSearch';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types/property';
import { PropertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  BadgePercent,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface HomePageProps {
  onOpenAIBroker: (property?: Property) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAIBroker }) => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    PropertyAPI.getProperties().then((all) => {
      setFeaturedProperties(all.filter((p) => p.featured || p.verified).slice(0, 6));
    });
  }, []);

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      {/* Hero Section & Search Engine */}
      <HeroSearch onAIBrokerClick={() => onOpenAIBroker()} />

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Handpicked Collections
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight">
              Featured Verified Properties
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Properties verified for clear titles, verified RERA certificates, and fair market valuations.
            </p>
          </div>

          <button
            onClick={() => handleProtectedNavigation('/explore')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 hover:text-amber-600 transition-colors cursor-pointer"
          >
            {!isAuthenticated && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onAskAIBroker={(p) => {
                if (!isAuthenticated) {
                  navigate(`/login?redirect=${encodeURIComponent(`/property/${p.id}`)}`);
                } else {
                  onOpenAIBroker(p);
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* RayBroker AI Spotlight Banner */}
      <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-navy-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold border border-gold-500/30">
              <Sparkles className="w-4 h-4" />
              Meet Your 24/7 AI Property Consultant
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Never Overpay for a Property Again. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300">
                Powered by RayBroker Intelligence.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              RayBroker benchmarks live listings against thousands of registered micro-market transactions to calculate fair market values, mortgage EMI scenarios, and effective negotiation strategies before you commit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-navy-850 border border-navy-800">
                <BadgePercent className="w-5 h-5 text-gold-400 mb-1" />
                <h4 className="text-xs font-bold text-white">Fair-Price Benchmark</h4>
                <p className="text-[11px] text-slate-400">Avoid inflated seller markups</p>
              </div>
              <div className="p-3 rounded-xl bg-navy-850 border border-navy-800">
                <TrendingUp className="w-5 h-5 text-gold-400 mb-1" />
                <h4 className="text-xs font-bold text-white">Rental Yield & ROI</h4>
                <p className="text-[11px] text-slate-400">Maximize buy-to-let returns</p>
              </div>
              <div className="p-3 rounded-xl bg-navy-850 border border-navy-800">
                <ShieldCheck className="w-5 h-5 text-gold-400 mb-1" />
                <h4 className="text-xs font-bold text-white">Verified Agent Network</h4>
                <p className="text-[11px] text-slate-400">Direct contact, zero spam</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenAIBroker()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-navy-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold-500/20 hover:scale-105 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Consult RayBroker AI Now</span>
              </button>
              <button
                onClick={() => handleProtectedNavigation('/sell')}
                className="px-6 py-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 font-semibold text-sm border border-navy-700 transition-colors cursor-pointer"
              >
                Get Property Valuation
              </button>
            </div>
          </div>

          {/* Interactive Mock Chat Card */}
          <div className="lg:col-span-5 bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-2xl relative">
            <div className="flex items-center gap-2 border-b border-navy-800 pb-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center font-bold text-navy-950 text-xs">
                R
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">RayBroker Live Simulation</h4>
                <p className="text-[10px] text-emerald-400 font-medium">Real-Time Valuation Engine</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-navy-800 text-slate-200 self-end ml-8">
                "Is ₹1.85 Cr a fair price for Prestige Lakeside 3 BHK in Whitefield?"
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-gold-500/30 text-slate-300 mr-4 space-y-2">
                <div className="flex items-center gap-1.5 text-gold-400 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Fair Market Value Analysis
                </div>
                <p className="text-slate-300">
                  Based on 14 recent transactions in Whitefield, the average rate is ₹9,350/sq.ft. The listed price of <strong>₹1.85 Cr</strong> is <strong>1.8% below the micro-market benchmark</strong>!
                </p>
                <div className="p-2 rounded bg-navy-900 border border-navy-800 text-[11px] text-slate-400 flex justify-between">
                  <span>Estimated Fair Value:</span>
                  <span className="text-white font-bold">₹1.88 Cr</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Top Cities Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-extrabold text-navy-950 mb-2">Explore Properties by City</h2>
        <p className="text-sm text-slate-500 mb-8">Direct access to prime residential and commercial hubs.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Bangalore', count: '1,420+ Listings', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
            { name: 'Mumbai', count: '2,890+ Listings', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=400&q=80' },
            { name: 'Gurgaon', count: '940+ Listings', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&q=80' },
            { name: 'Hyderabad', count: '1,150+ Listings', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80' },
            { name: 'Pune', count: '820+ Listings', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80' },
            { name: 'Delhi', count: '1,680+ Listings', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
          ].map((city) => (
            <button
              key={city.name}
              onClick={() => handleProtectedNavigation(`/explore?city=${city.name}`)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-sm hover:shadow-lg transition-all text-left cursor-pointer"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 opacity-70 group-hover:opacity-60 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent flex flex-col justify-end p-3.5 text-white">
                <h4 className="font-bold text-sm tracking-tight">{city.name}</h4>
                <p className="text-[11px] text-gold-300 font-medium">{city.count}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
