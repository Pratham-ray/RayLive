export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  agencyName: string;
  licenseNumber: string;
  rating: number;
  totalReviews: number;
  activeListingsCount: number;
  totalDeals: number;
  bio: string;
  avatarUrl: string;
  verified: boolean;
}
