import { Property } from './property';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  intent?: 'SEARCH' | 'DEAL_EVALUATION' | 'MORTGAGE_CALC' | 'GENERAL_ADVICE';
  recommendedProperties?: Property[];
  financials?: {
    loanAmount?: number;
    interestRate?: string;
    tenureYears?: number;
    monthlyEMI?: number;
    totalInterestPayable?: number;
    totalRepaymentAmount?: number;
    listedPrice?: number;
    fairMarketValue?: number;
    priceVariancePercent?: number;
    pricePerSqFt?: number;
    rentalYieldPercentage?: number;
  };
  suggestions?: string[];
}

export interface ValuationData {
  estimatedFairPrice: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  estimatedPricePerSqFt: number;
  confidenceLevel: 'HIGH' | 'MODERATE' | 'ESTIMATED';
  estimatedRentalYieldPercentage: number;
  localComparableSales: Partial<Property>[];
  valuationSummary: string;
}
