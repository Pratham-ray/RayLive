import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  IndianRupee, 
  Bed, 
  Maximize2,
  ShieldCheck,
  Check,
  Eye,
  Camera,
  Layers,
  ArrowLeft,
  UploadCloud,
  X,
  ImagePlus,
  Plus,
  Trash2
} from 'lucide-react';
import { ListingType, PropertyType, Property } from '../types/property';
import { CITIES } from '../data/mockProperties';
import { PropertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AVAILABLE_AMENITIES = [
  'Gated Society',
  'Power Backup',
  '24/7 Security',
  'Reserved Parking',
  'Swimming Pool',
  'Gym & Fitness Center',
  'Clubhouse',
  'Children Play Area',
  'EV Charging Station',
  'Private Terrace'
];

export const SellPropertyPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState<ListingType>('BUY');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [city, setCity] = useState('Bangalore');
  const [locality, setLocality] = useState('');
  const [areaSqFt, setAreaSqFt] = useState('1500');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [furnishingStatus, setFurnishingStatus] = useState<'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished'>('Semi-Furnished');
  const [askingPrice, setAskingPrice] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Gated Society',
    'Power Backup',
    '24/7 Security',
    'Reserved Parking'
  ]);

  // Contact State
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProperty, setCreatedProperty] = useState<Property | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name);
      if (!contactEmail) setContactEmail(user.email);
      if (!contactPhone && user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAddImageUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setUploadedImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Instant AI Price Valuation calculation for the owner
  const area = Number(areaSqFt) || 1200;
  const baseRate = city.toLowerCase() === 'mumbai' ? 18000 : city.toLowerCase() === 'delhi' ? 13000 : 9500;
  const estimatedBuy = area * baseRate;
  const estimatedRent = Math.round((estimatedBuy * 0.035) / 12);
  const estimatedPrice = listingType === 'RENT' ? estimatedRent : estimatedBuy;

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/sell');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalTitle = title.trim() || `${bedrooms} BHK ${propertyType.replace('_', ' ')} in ${locality}, ${city}`;
      const defaultImage = listingType === 'RENT'
        ? 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
        : propertyType === 'VILLA'
        ? 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
        : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

      const newProperty = await PropertyAPI.createProperty({
        title: finalTitle,
        description: description.trim() || `Prime ${bedrooms} BHK ${propertyType.replace('_', ' ')} available for ${listingType.toLowerCase()} in ${locality}, ${city}. Features ${areaSqFt} sq.ft super area, ${furnishingStatus} interior, and high-end community amenities.`,
        listingType,
        propertyType,
        price: Number(askingPrice),
        areaSqFt: Number(areaSqFt),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        furnishingStatus,
        locality: locality.trim(),
        city,
        state: city === 'Mumbai' || city === 'Pune' ? 'Maharashtra' : city === 'Hyderabad' ? 'Telangana' : 'Karnataka',
        pincode: '560001',
        amenities: selectedAmenities,
        images: uploadedImages.length > 0 ? uploadedImages : [defaultImage],
        contactName: contactName.trim() || user?.name || 'Property Owner',
        contactPhone: contactPhone.trim() || '+91 98765 43210',
        contactEmail: contactEmail.trim() || user?.email || 'owner@raylive.in'
      });

      setCreatedProperty(newProperty);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to publish property', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            Verified Owner & Landlord Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
            List Your Property on RayLive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            Get your listing in front of verified buyers & tenants with real-time fair market price benchmarking.
          </p>
        </div>

        {submitted && createdProperty ? (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                Live & Published
              </span>
              <h2 className="text-2xl font-black text-navy-950">Property Listed Successfully!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your listing is now live across RayLive! Buyers and tenants can discover it, request visits, and run AI evaluations.
              </p>
            </div>

            {/* Preview Card of Created Property */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left flex flex-col sm:flex-row items-center gap-4">
              <img
                src={createdProperty.images[0]}
                alt={createdProperty.title}
                className="w-full sm:w-36 h-28 rounded-xl object-cover"
              />
              <div className="space-y-1 flex-1">
                <p className="text-xs font-black text-gold-600 uppercase tracking-wider">
                  {createdProperty.listingType === 'BUY' ? 'For Sale' : 'For Rent'} • {createdProperty.propertyType}
                </p>
                <h4 className="font-extrabold text-sm text-navy-950 line-clamp-1">
                  {createdProperty.title}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{createdProperty.locality}, {createdProperty.city}</span>
                </p>
                <p className="text-base font-black text-navy-950 pt-1">
                  {createdProperty.formattedPrice}
                </p>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/property/${createdProperty.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy-950 text-gold-400 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-navy-900 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Live Listing</span>
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Browse All Properties</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setTitle('');
                  setLocality('');
                  setAskingPrice('');
                }}
                className="w-full sm:w-auto text-xs font-bold text-slate-500 hover:text-slate-800 underline py-2 cursor-pointer"
              >
                List Another Property
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
            
            {/* Listing Type Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Listing Purpose
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setListingType('BUY')}
                  className={`py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                    listingType === 'BUY'
                      ? 'bg-navy-900 text-gold-400 border-navy-900 shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sell My Property
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('RENT')}
                  className={`py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                    listingType === 'RENT'
                      ? 'bg-navy-900 text-gold-400 border-navy-900 shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Rent Out My Property
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title & Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Listing Headline / Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ultra-Luxury 3BHK Penthouse with Lake View"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-gold-500 focus:bg-white"
                />
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-gold-500"
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Landmark</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Indiranagar, Whitefield, Bandra"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-gold-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-gold-500"
                  >
                    <option value="APARTMENT">Apartment / High-rise Flat</option>
                    <option value="VILLA">Independent Luxury Villa</option>
                    <option value="PENTHOUSE">Skyline Penthouse</option>
                    <option value="STUDIO">Studio Flat</option>
                    <option value="COMMERCIAL_OFFICE">Commercial Office Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms (BHK)</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-gold-500"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Super Built-up Area (Sq.Ft)</label>
                  <input
                    type="number"
                    required
                    min="300"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-gold-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Furnishing Status</label>
                  <select
                    value={furnishingStatus}
                    onChange={(e) => setFurnishingStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-gold-500"
                  >
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully-Furnished">Fully-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Expected Asking Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder={listingType === 'RENT' ? 'e.g. 55000 (Monthly rent)' : 'e.g. 17500000 (Total price in ₹)'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-navy-950 focus:outline-none focus:border-gold-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* AI Real-Time Price Valuation Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-300 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-950 font-extrabold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>RayBroker Real-Time Price Benchmark</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-slate-700">
                    Estimated fair value for a {bedrooms} BHK ({areaSqFt} sq.ft) in {city}:
                  </span>
                  <strong className="text-navy-950 font-black text-sm">
                    {listingType === 'RENT' ? `₹${estimatedPrice.toLocaleString('en-IN')}/mo` : `₹${(estimatedPrice / 10000000).toFixed(2)} Cr`}
                  </strong>
                </div>
                <p className="text-[11px] text-slate-600">
                  ⚡ Pricing your property within ±5% of this benchmark reduces days-on-market by 42%.
                </p>
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Amenities Included
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const checked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          checked
                            ? 'bg-amber-50/80 border-gold-500 text-navy-950'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate pr-1">{amenity}</span>
                        {checked && <Check className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag-and-Drop Image Uploader */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Property Photos ({uploadedImages.length})
                  </label>
                  <span className="text-[11px] text-slate-400">
                    PNG, JPG, WEBP (First photo is cover)
                  </span>
                </div>

                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-gold-500 bg-amber-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-gold-400 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center mx-auto mb-2">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-navy-950">
                    Drag and drop photos here, or <span className="text-amber-600 underline">browse files</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Upload multiple high-resolution photos of living room, bedrooms, kitchen, and exterior
                  </p>
                </div>

                {/* Add Image by URL option */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Camera className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste an image web link (URL)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-gold-500 focus:bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                {/* Uploaded Photos Grid Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-xs"
                      >
                        <img
                          src={img}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-navy-950/90 text-gold-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                            Cover Photo
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer opacity-90 group-hover:opacity-100"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Owner / Broker Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number (+91)</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-navy-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Publishing to RayLive...' : 'Publish Property Listing'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
