import { Property, SearchFilters, PropertyCreateInput } from '../types/property';
import { Agent } from '../types/agent';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { MOCK_AGENTS } from '../data/mockAgents';
import { AIBrokerClient } from './aiBroker';
import { ChatMessage, ValuationData } from '../types/ai';
import { InquiryRequest, InquiryResponse } from '../types/inquiry';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
const LOCAL_INQUIRIES_KEY = 'raylive_user_inquiries';
const LOCAL_PROPERTIES_KEY = 'raylive_custom_properties';

const formatPrice = (price: number, listingType: string): string => {
  if (listingType === 'RENT') {
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} Lakh`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

export const PropertyAPI = {
  getCustomProperties(): Property[] {
    try {
      const stored = localStorage.getItem(LOCAL_PROPERTIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async getProperties(filters?: SearchFilters): Promise<Property[]> {
    const customProps = this.getCustomProperties();

    try {
      const params = new URLSearchParams();
      if (filters?.listingType) params.append('listingType', filters.listingType);
      if (filters?.propertyType) params.append('propertyType', filters.propertyType);
      if (filters?.city && filters.city !== 'All Cities') params.append('city', filters.city);
      if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms.toString());

      const res = await fetch(`${API_BASE}/properties?${params.toString()}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (data.content && data.content.length > 0) {
          // Merge custom properties at the top if any
          return [...customProps, ...data.content];
        }
      }
    } catch {
      // Backend not running, use client-side mock store
    }

    // Client-side fallback filtering
    let results = [...customProps, ...MOCK_PROPERTIES];
    if (filters?.listingType) {
      results = results.filter(p => p.listingType === filters.listingType);
    }
    if (filters?.propertyType) {
      results = results.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters?.city && filters.city !== 'All Cities') {
      results = results.filter(p => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters?.bedrooms) {
      results = results.filter(p => p.bedrooms === Number(filters.bedrooms));
    }
    if (filters?.minPrice) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }

    // Sorting
    if (filters?.sortBy === 'priceAsc') {
      results.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'priceDesc') {
      results.sort((a, b) => b.price - a.price);
    } else if (filters?.sortBy === 'popular') {
      results.sort((a, b) => b.viewsCount - a.viewsCount);
    }

    return results;
  },

  async getPropertyById(id: number): Promise<Property | undefined> {
    // Check custom properties first
    const customProps = this.getCustomProperties();
    const foundCustom = customProps.find(p => p.id === id);
    if (foundCustom) return foundCustom;

    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return MOCK_PROPERTIES.find(p => p.id === id);
  },

  async createProperty(input: PropertyCreateInput): Promise<Property> {
    const formatted = formatPrice(input.price, input.listingType);
    const pricePerSqFt = input.areaSqFt > 0 ? Math.round(input.price / input.areaSqFt) : 0;

    const payload = {
      ...input,
      rentFrequency: input.listingType === 'RENT' ? 'MONTHLY' : 'NOT_APPLICABLE'
    };

    try {
      const res = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2000),
      });

      if (res.ok) {
        const created: Property = await res.json();
        // Also save to custom list for local caching
        this.saveCustomProperty(created);
        return created;
      }
    } catch {
      // Backend offline fallback
    }

    // Fallback Property object
    const fallbackProperty: Property = {
      id: Date.now(),
      title: input.title,
      description: input.description || `Beautiful ${input.bedrooms || 3} BHK ${input.propertyType.replace('_', ' ')} located in prime ${input.locality}, ${input.city}.`,
      listingType: input.listingType,
      propertyType: input.propertyType,
      status: 'AVAILABLE',
      price: input.price,
      formattedPrice: formatted,
      rentFrequency: input.listingType === 'RENT' ? 'MONTHLY' : 'NOT_APPLICABLE',
      areaSqFt: input.areaSqFt,
      pricePerSqFt,
      bedrooms: input.bedrooms || 3,
      bathrooms: input.bathrooms || 2,
      furnishingStatus: input.furnishingStatus || 'Semi-Furnished',
      locality: input.locality,
      city: input.city,
      state: input.state || 'Karnataka',
      country: 'India',
      pincode: input.pincode || '560001',
      latitude: 12.9716,
      longitude: 77.5946,
      amenities: input.amenities && input.amenities.length > 0
        ? input.amenities
        : ['Gated Society', 'Power Backup', '24/7 Security', 'Reserved Parking', 'Clubhouse'],
      images: input.images && input.images.length > 0
        ? input.images
        : [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
          ],
      verified: true,
      featured: true,
      viewsCount: 1,
      inquiriesCount: 0,
      createdAt: new Date().toISOString(),
      agent: {
        id: 1,
        name: input.contactName || 'Vikram Malhotra',
        agencyName: 'RayLive Verified Premier Network',
        phone: input.contactPhone || '+91 98765 43210',
        email: input.contactEmail || 'agent@raylive.in',
        rating: 4.9,
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        verified: true
      }
    };

    this.saveCustomProperty(fallbackProperty);
    return fallbackProperty;
  },

  saveCustomProperty(prop: Property) {
    try {
      const existing = this.getCustomProperties();
      const updated = [prop, ...existing.filter(p => p.id !== prop.id)];
      localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom property locally', e);
    }
  },

  async getAgents(): Promise<Agent[]> {
    try {
      const res = await fetch(`${API_BASE}/agents`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return MOCK_AGENTS;
  },

  async askAIBroker(query: string, targetProperty?: Property): Promise<ChatMessage> {
    return AIBrokerClient.processQuery(query, targetProperty, MOCK_PROPERTIES);
  },

  async getValuation(property: Property): Promise<ValuationData> {
    return AIBrokerClient.calculateValuation(property);
  },

  // Tour Booking & Inquiry APIs
  async createInquiry(req: InquiryRequest, propertyFallback?: Property): Promise<InquiryResponse> {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data: InquiryResponse = await res.json();
        this.saveLocalInquiry(data);
        return data;
      }
    } catch {
      // Backend offline fallback
    }

    const fallbackResponse: InquiryResponse = {
      id: Date.now(),
      propertyId: req.propertyId,
      propertyTitle: propertyFallback?.title || 'Luxury Residence',
      propertyCity: propertyFallback?.city || 'Bangalore',
      propertyFormattedPrice: propertyFallback?.formattedPrice || '₹1.50 Cr',
      propertyImageUrl: propertyFallback?.images[0],
      name: req.name,
      email: req.email,
      phone: req.phone,
      message: req.message,
      preferredTourDate: req.preferredTourDate || new Date().toISOString().split('T')[0],
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    this.saveLocalInquiry(fallbackResponse);
    return fallbackResponse;
  },

  async getInquiries(email?: string): Promise<InquiryResponse[]> {
    try {
      const url = email ? `${API_BASE}/inquiries?email=${encodeURIComponent(email)}` : `${API_BASE}/inquiries`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Backend offline fallback
    }

    try {
      const stored = localStorage.getItem(LOCAL_INQUIRIES_KEY);
      if (stored) {
        const parsed: InquiryResponse[] = JSON.parse(stored);
        if (email) {
          return parsed.filter(i => i.email.toLowerCase() === email.toLowerCase());
        }
        return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  },

  async cancelInquiry(id: number): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(1500),
      });
    } catch {
      // ignore
    }

    try {
      const stored = localStorage.getItem(LOCAL_INQUIRIES_KEY);
      if (stored) {
        const list: InquiryResponse[] = JSON.parse(stored);
        const filtered = list.filter(i => i.id !== id);
        localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }
    return true;
  },

  saveLocalInquiry(inquiry: InquiryResponse) {
    try {
      const stored = localStorage.getItem(LOCAL_INQUIRIES_KEY);
      const list: InquiryResponse[] = stored ? JSON.parse(stored) : [];
      const updated = [inquiry, ...list.filter(i => i.id !== inquiry.id)];
      localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save inquiry locally', e);
    }
  }
};

export const UserAPI = {
  async getFavorites(email?: string, token?: string): Promise<number[]> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const url = email ? `${API_BASE}/users/favorites?email=${encodeURIComponent(email)}` : `${API_BASE}/users/favorites`;
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch {
      // offline fallback
    }
    return [];
  },

  async addFavorite(propertyId: number, email?: string, token?: string): Promise<number[] | null> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const url = email ? `${API_BASE}/users/favorites/${propertyId}?email=${encodeURIComponent(email)}` : `${API_BASE}/users/favorites/${propertyId}`;
      const res = await fetch(url, { method: 'POST', headers, signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline
    }
    return null;
  },

  async removeFavorite(propertyId: number, email?: string, token?: string): Promise<number[] | null> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const url = email ? `${API_BASE}/users/favorites/${propertyId}?email=${encodeURIComponent(email)}` : `${API_BASE}/users/favorites/${propertyId}`;
      const res = await fetch(url, { method: 'DELETE', headers, signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline
    }
    return null;
  },

  async getMyListings(email?: string, token?: string): Promise<Property[]> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const url = email ? `${API_BASE}/users/my-listings?email=${encodeURIComponent(email)}` : `${API_BASE}/users/my-listings`;
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline
    }
    return [];
  }
};
