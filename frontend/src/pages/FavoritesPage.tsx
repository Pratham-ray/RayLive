import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Property } from '../types/property';
import { PropertyAPI } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Trash2, 
  Sparkles, 
  ArrowLeft, 
  Compass, 
  ShieldCheck,
  TrendingUp,
  Building2,
  Lock
} from 'lucide-react';

interface FavoritesPageProps {
  onOpenAIBroker: (property?: Property) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onOpenAIBroker }) => {
  const { favorites, clearFavorites, favoriteCount } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PropertyAPI.getProperties().then((all) => {
      setProperties(all);
      setLoading(false);
    });
  }, []);

  // Filter properties that are in user's favorites
  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  // Portfolio aggregates
  const totalValue = savedProperties.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const avgSqFt = savedProperties.length > 0 
    ? Math.round(savedProperties.reduce((acc, curr) => acc + (curr.pricePerSqFt || 0), 0) / savedProperties.length)
    : 0;

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-navy-950 mb-2">Sign in to View Saved Homes</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Your saved properties, price alerts, and custom AI valuations are synced to your RayLive account.
          </p>
          <button
            onClick={() => navigate('/login?redirect=/favorites')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
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
          
          {savedProperties.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all your saved properties?')) {
                  clearFavorites();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Page Title & Overview */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-navy-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Heart className="w-4 h-4 fill-rose-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                Personal Portfolio Watchlist
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              My Saved Properties
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Track your favorite homes, compare neighborhood valuations, and get instant deal ratings from RayBroker AI.
            </p>

            {/* Summary Stat Pills */}
            {savedProperties.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-navy-800/80">
                <div className="bg-navy-900/80 p-3 rounded-xl border border-navy-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bookmarked</p>
                  <p className="text-xl font-black text-white mt-0.5">{savedProperties.length} Properties</p>
                </div>
                <div className="bg-navy-900/80 p-3 rounded-xl border border-navy-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Value</p>
                  <p className="text-xl font-black text-gold-400 mt-0.5">{formatCurrency(totalValue)}</p>
                </div>
                <div className="bg-navy-900/80 p-3 rounded-xl border border-navy-800 col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg. Rate</p>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">₹{avgSqFt.toLocaleString('en-IN')}/sq.ft</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Saved Listings Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-sm font-semibold text-slate-500">Loading your saved properties...</p>
          </div>
        ) : savedProperties.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-inner">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-navy-950 mb-1">
              Your watchlist is empty
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              You haven't saved any properties yet. Tap the heart icon on any property card to save it here for quick access and price tracking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy-950 text-gold-400 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-navy-900 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Properties</span>
              </Link>
              <button
                onClick={() => onOpenAIBroker()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Ask RayBroker AI</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Showing {savedProperties.length} saved {savedProperties.length === 1 ? 'property' : 'properties'}
              </p>
              
              <button
                onClick={() => onOpenAIBroker()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Compare with RayBroker AI</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onAskAIBroker={onOpenAIBroker}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
