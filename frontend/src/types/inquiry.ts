export interface InquiryRequest {
  propertyId: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredTourDate?: string;
  timeSlot?: string;
}

export interface InquiryResponse {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertyCity: string;
  propertyFormattedPrice?: string;
  propertyImageUrl?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredTourDate?: string;
  status: string;
  createdAt: string;
}
