export type ListingType = 'BUY' | 'RENT' | 'COMMERCIAL';

export type PropertyType = 
  | 'APARTMENT'
  | 'VILLA'
  | 'PENTHOUSE'
  | 'PLOT'
  | 'STUDIO'
  | 'COMMERCIAL_OFFICE'
  | 'COMMERCIAL_RETAIL'
  | 'WAREHOUSE';

export type PropertyStatus = 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD' | 'RENTED';

export type RentFrequency = 'MONTHLY' | 'YEARLY' | 'NOT_APPLICABLE';

export interface AgentSummary {
  id: number;
  name: string;
  agencyName: string;
  phone: string;
  email: string;
  rating: number;
  avatarUrl?: string;
  verified: boolean;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  formattedPrice: string;
  rentFrequency: RentFrequency;
  securityDeposit?: number;
  maintenancePerMonth?: number;
  areaSqFt: number;
  pricePerSqFt?: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished';
  parkingSpots?: number;
  floorNumber?: number;
  totalFloors?: number;
  yearBuilt?: number;
  
  address?: string;
  locality: string;
  city: string;
  state?: string;
  country: string;
  pincode?: string;
  latitude: number;
  longitude: number;

  amenities: string[];
  images: string[];

  verified: boolean;
  featured: boolean;
  viewsCount: number;
  inquiriesCount: number;

  agent?: AgentSummary;
  createdAt: string;
}

export interface SearchFilters {
  listingType?: ListingType;
  propertyType?: PropertyType | '';
  city?: string;
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | '';
  furnishingStatus?: string;
  sortBy?: 'newest' | 'priceAsc' | 'priceDesc' | 'popular';
}

export interface PropertyCreateInput {
  title: string;
  description?: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  areaSqFt: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished';
  locality: string;
  city: string;
  state?: string;
  pincode?: string;
  amenities?: string[];
  images?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}
