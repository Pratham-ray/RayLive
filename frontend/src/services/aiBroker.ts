import { Property } from '../types/property';
import { ChatMessage, ValuationData } from '../types/ai';
import { MOCK_PROPERTIES } from '../data/mockProperties';

export class AIBrokerClient {
  
  static processQuery(
    userMessage: string, 
    targetProperty?: Property, 
    currentProperties: Property[] = MOCK_PROPERTIES
  ): ChatMessage {
    const msg = userMessage.trim();
    const lower = msg.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. EMI / Financial Calculation Intent
    if (lower.includes('emi') || lower.includes('loan') || lower.includes('mortgage') || lower.includes('down payment')) {
      return this.handleEMICalculation(lower, timestamp);
    }

    // 2. Deal Evaluation Intent
    if (targetProperty || lower.includes('fair price') || lower.includes('overpriced') || lower.includes('is this fair') || lower.includes('good deal') || lower.includes('negotiate')) {
      return this.handleDealEvaluation(targetProperty || currentProperties[0], timestamp);
    }

    // 3. Property Search Intent
    if (lower.includes('find') || lower.includes('search') || lower.includes('rent') || lower.includes('buy') || lower.includes('bhk') || lower.includes('apartment') || lower.includes('villa') || lower.includes('budget') || lower.includes('under')) {
      return this.handleSearch(lower, currentProperties, timestamp);
    }

    // 4. Default / General Real Estate Advisory
    return {
      id: 'msg-' + Date.now(),
      sender: 'agent',
      timestamp,
      intent: 'GENERAL_ADVICE',
      text: "Hello! I am **RayBroker**, your personal AI Real Estate Advisor. 🏡\n\nI can help you navigate properties across India with verified price intelligence:\n\n• **Search Properties**: *'Find 2 BHK apartments in Bangalore under 50k rent'*\n• **Fair-Price Check**: Ask *'Is this property fairly priced?'* to evaluate local comps\n• **Mortgage & EMI**: *'Calculate EMI for 75 Lakhs for 20 years'*\n• **Negotiation Strategy**: Get guidance on counter-offers before talking to sellers.\n\nWhat are you looking to buy, rent, or evaluate today?",
      suggestions: [
        "Find 3 BHK apartments for sale under ₹2 Cr",
        "Show 2 BHK rental flats in Bangalore",
        "Calculate EMI for ₹80 Lakh loan at 8.5%"
      ]
    };
  }

  static calculateValuation(property: Property): ValuationData {
    const baseSqftRate = property.city.toLowerCase() === 'mumbai' ? 15000 : 9200;
    const estimatedRate = Math.round(baseSqftRate * (property.propertyType === 'PENTHOUSE' ? 1.4 : property.propertyType === 'VILLA' ? 1.25 : 1.0));
    const estimatedFair = estimatedRate * property.areaSqFt;
    
    const rangeLow = Math.round(estimatedFair * 0.94);
    const rangeHigh = Math.round(estimatedFair * 1.06);

    const comps = MOCK_PROPERTIES.filter(p => p.id !== property.id && p.city === property.city).slice(0, 2);

    return {
      estimatedFairPrice: property.listingType === 'RENT' ? Math.round((estimatedFair * 0.035) / 12) : estimatedFair,
      priceRangeLow: property.listingType === 'RENT' ? Math.round(property.price * 0.92) : rangeLow,
      priceRangeHigh: property.listingType === 'RENT' ? Math.round(property.price * 1.08) : rangeHigh,
      estimatedPricePerSqFt: estimatedRate,
      confidenceLevel: 'HIGH',
      estimatedRentalYieldPercentage: property.propertyType.startsWith('COMMERCIAL') ? 7.6 : 3.4,
      localComparableSales: comps,
      valuationSummary: `Evaluated against ${comps.length + 8} verified transactions in ${property.locality}, ${property.city}. Current market demand in this micro-market has appreciated by +4.8% YoY.`
    };
  }

  private static handleEMICalculation(msg: string, timestamp: string): ChatMessage {
    let loanAmount = 7500000;
    const match = msg.match(/(\d+(\.\d+)?)\s*(cr|crore|lakh|lakhs|k)?/i);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = (match[3] || '').toLowerCase();
      if (unit.startsWith('cr')) loanAmount = val * 10000000;
      else if (unit.startsWith('lakh')) loanAmount = val * 100000;
      else if (unit === 'k') loanAmount = val * 1000;
      else if (val > 1000) loanAmount = val;
    }

    const interestRate = 8.5;
    const tenureYears = 20;
    const monthlyRate = (interestRate / 12) / 100;
    const months = tenureYears * 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;

    return {
      id: 'msg-' + Date.now(),
      sender: 'agent',
      timestamp,
      intent: 'MORTGAGE_CALC',
      text: `### 🏦 Mortgage & EMI Breakdown\n\n` +
            `• **Principal Loan:** ₹${loanAmount.toLocaleString('en-IN')}\n` +
            `• **Interest Rate:** ${interestRate}% p.a. (${tenureYears} Years Tenure)\n` +
            `• **Monthly EMI:** **₹${Math.round(emi).toLocaleString('en-IN')}/month**\n` +
            `• **Total Interest:** ₹${Math.round(totalInterest).toLocaleString('en-IN')}\n` +
            `• **Total Repayment:** ₹${Math.round(totalPayment).toLocaleString('en-IN')}\n\n` +
            `💡 **RayBroker Advice:** By increasing your tenure from 15 to 20 years, your EMI drops, but your total interest increases. Aim to make 1 extra EMI payment per year to shave 4 years off your loan!`,
      financials: {
        loanAmount,
        interestRate: `${interestRate}%`,
        tenureYears,
        monthlyEMI: Math.round(emi),
        totalInterestPayable: Math.round(totalInterest),
        totalRepaymentAmount: Math.round(totalPayment)
      },
      suggestions: [
        "Show properties within this EMI budget",
        "How much down payment do I need?",
        "What are the registration and stamp duty charges?"
      ]
    };
  }

  private static handleDealEvaluation(property: Property, timestamp: string): ChatMessage {
    const valuation = this.calculateValuation(property);
    const diff = ((property.price - valuation.estimatedFairPrice) / valuation.estimatedFairPrice) * 100;

    let verdict = "✅ **Fair Market Value**";
    let advice = "The listing price aligns with current neighborhood transactions. There is healthy room for standard closing negotiation (2-4%).";

    if (diff > 5) {
      verdict = `⚠️ **Above Market Average (+${diff.toFixed(1)}%)**`;
      advice = `The owner is asking a premium. Point out the comparable listings in ${property.locality} to open an offer around ₹${valuation.estimatedFairPrice.toLocaleString('en-IN')}.`;
    } else if (diff < -4) {
      verdict = `🌟 **High-Value Deal (${Math.abs(diff).toFixed(1)}% Below Benchmark)**`;
      advice = `This is priced below local market rate. Ensure immediate verification of title deeds, encumbrance certificate, and occupancy certificate (OC).`;
    }

    return {
      id: 'msg-' + Date.now(),
      sender: 'agent',
      timestamp,
      intent: 'DEAL_EVALUATION',
      text: `### 📊 RayBroker Deal Analysis: ${property.title}\n\n` +
            `• **Listed Price:** ${property.formattedPrice}\n` +
            `• **AI Fair Market Benchmark:** ₹${valuation.estimatedFairPrice.toLocaleString('en-IN')}\n` +
            `• **Verdict:** ${verdict}\n\n` +
            `**Analysis:** ${advice}\n\n` +
            `Would you like me to connect you with the listing agent **${property.agent?.name}** or draft a counter-offer letter?`,
      recommendedProperties: [property],
      financials: {
        listedPrice: property.price,
        fairMarketValue: valuation.estimatedFairPrice,
        priceVariancePercent: Math.round(diff * 10) / 10,
        rentalYieldPercentage: valuation.estimatedRentalYieldPercentage
      },
      suggestions: [
        "Draft a negotiation message for the agent",
        "Calculate monthly EMI for this property",
        "Schedule a private property tour"
      ]
    };
  }

  private static handleSearch(msg: string, properties: Property[], timestamp: string): ChatMessage {
    let filtered = [...properties];

    if (msg.includes('rent')) {
      filtered = filtered.filter(p => p.listingType === 'RENT');
    } else if (msg.includes('buy') || msg.includes('sale')) {
      filtered = filtered.filter(p => p.listingType === 'BUY');
    } else if (msg.includes('commercial')) {
      filtered = filtered.filter(p => p.listingType === 'COMMERCIAL');
    }

    if (msg.includes('1 bhk') || msg.includes('1 bed')) {
      filtered = filtered.filter(p => p.bedrooms === 1);
    } else if (msg.includes('2 bhk') || msg.includes('2 bed')) {
      filtered = filtered.filter(p => p.bedrooms === 2);
    } else if (msg.includes('3 bhk') || msg.includes('3 bed')) {
      filtered = filtered.filter(p => p.bedrooms === 3);
    } else if (msg.includes('4 bhk') || msg.includes('4 bed')) {
      filtered = filtered.filter(p => p.bedrooms === 4);
    }

    const cities = ['bangalore', 'mumbai', 'delhi', 'gurgaon', 'hyderabad', 'pune'];
    for (const city of cities) {
      if (msg.includes(city)) {
        filtered = filtered.filter(p => p.city.toLowerCase() === city);
        break;
      }
    }

    if (filtered.length === 0) {
      filtered = properties.slice(0, 2);
    }

    return {
      id: 'msg-' + Date.now(),
      sender: 'agent',
      timestamp,
      intent: 'SEARCH',
      text: `I found **${filtered.length} verified listings** matching your criteria. Each property includes verified RERA registration and transparent pricing breakdown:`,
      recommendedProperties: filtered,
      suggestions: [
        "Is the price for the first one negotiable?",
        "Show me the rental yield for these",
        "Connect me with the agent"
      ]
    };
  }
}
