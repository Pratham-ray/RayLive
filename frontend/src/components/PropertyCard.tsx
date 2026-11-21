import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  Share2, 
  Heart,
  Lock,
  Check
} from 'lucide-react';
import { Property } from '../types/property';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

interface PropertyCardProps {
  property: Property;
  onAskAIBroker?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onAskAIBroker }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  const isSaved = isFavorite(property.id);

  const handleOpenDetails = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/property/${property.id}`)}`);
    } else {
      navigate(`/property/${property.id}`);
    }
  };

  const handleAskAIBroker = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/property/${property.id}`)}`);
    } else if (onAskAIBroker) {
      onAskAIBroker(property);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/property/${property.id}`)}`);
      return;
    }
    toggleFavorite(property.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/property/${property.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-gold-500/40 transition-all duration-300 flex flex-col">
      
      {/* Image & Badges Container */}
      <div 
        onClick={handleOpenDetails}
        className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={property.images[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            property.listingType === 'BUY' 
              ? 'bg-navy-900/90 text-gold-400 border border-gold-500/30' 
              : property.listingType === 'RENT'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30'
              : 'bg-indigo-950/90 text-indigo-300 border border-indigo-500/30'
          }`}>
            {property.listingType === 'BUY' ? 'For Sale' : property.listingType === 'RENT' ? 'For Rent' : 'Commercial'}
          </span>

          {property.verified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-sm shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified RERA
            </span>
          )}

          {property.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-navy-950 shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Quick Action Top-Right: Heart and Share */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button 
            type="button" 
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-all transform active:scale-90 cursor-pointer ${
              isSaved 
                ? 'bg-white text-rose-500 shadow-md ring-2 ring-rose-400' 
                : 'bg-black/40 hover:bg-black/60 text-white hover:text-rose-300'
            }`}
            title={isSaved ? "Remove from saved" : "Save property"}
            aria-label="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 stroke-rose-500 animate-pulse' : ''}`} />
          </button>
          
          <button 
            type="button" 
            onClick={handleShare}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors cursor-pointer"
            title={copied ? "Link copied!" : "Share property"}
            aria-label="Share property link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Property Type & Location overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-xs font-medium text-slate-200 drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>
        </div>

      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div>
              <span className="text-2xl font-black tracking-tight text-navy-900">
                {property.formattedPrice}
              </span>
              {property.pricePerSqFt && (
                <span className="ml-2 text-xs text-slate-500 font-medium">
                  (₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft)
                </span>
              )}
            </div>
            
            {/* Views counter */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{property.viewsCount}</span>
            </div>
          </div>

          {/* Title */}
          <button 
            onClick={handleOpenDetails} 
            className="block text-left group-hover:text-amber-600 transition-colors w-full cursor-pointer"
          >
            <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-1 mb-2">
              {property.title}
            </h3>
          </button>

          {/* Specs: BHK, Baths, SqFt */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-3">
            {property.bedrooms ? (
              <div className="flex items-center gap-1.5 font-medium">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>{property.bedrooms} Beds</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-medium">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>{property.propertyType.replace('_', ' ')}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 font-medium">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathrooms || 1} Baths</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{property.areaSqFt.toLocaleString('en-IN')} sq.ft</span>
            </div>
          </div>

          {/* Amenities Pills (Top 2) */}
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 2).map((amenity) => (
              <span key={amenity} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 2 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{property.amenities.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Ask AI Broker & View Details */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          
          <button
            type="button"
            onClick={handleAskAIBroker}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Price Check</span>
          </button>

          <button
            type="button"
            onClick={handleOpenDetails}
            className="py-2 px-4 rounded-xl bg-navy-900 hover:bg-navy-850 text-white text-xs font-bold text-center transition-colors flex items-center gap-1 cursor-pointer"
          >
            {!isAuthenticated && <Lock className="w-3 h-3 text-gold-400" />}
            <span>Details</span>
          </button>
        </div>

      </div>

    </div>
  );
};
