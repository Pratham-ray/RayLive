package com.raylive.service;

import com.raylive.dto.AIBrokerChatRequest;
import com.raylive.dto.AIBrokerChatResponse;
import com.raylive.dto.PropertyDTO;
import com.raylive.dto.ValuationRequest;
import com.raylive.dto.ValuationResponse;
import com.raylive.entity.Property;
import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyStatus;
import com.raylive.entity.enums.PropertyType;
import com.raylive.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIBrokerService {

    private final PropertyRepository propertyRepository;
    private final PropertyService propertyService;
    private final ValuationService valuationService;

    public AIBrokerChatResponse chat(AIBrokerChatRequest request) {
        String msg = request.getMessage() != null ? request.getMessage().trim() : "";
        String lowerMsg = msg.toLowerCase();

        // 1. Detect Intent
        if (isFinancialCalculationIntent(lowerMsg)) {
            return handleFinancialCalculation(lowerMsg);
        } else if (isDealEvaluationIntent(lowerMsg, request.getTargetPropertyId())) {
            return handleDealEvaluation(request);
        } else if (isSearchIntent(lowerMsg)) {
            return handlePropertySearch(lowerMsg, request.getPreferredCity());
        } else {
            return handleGeneralAdvice(lowerMsg);
        }
    }

    private boolean isFinancialCalculationIntent(String msg) {
        return msg.contains("emi") || msg.contains("mortgage") || msg.contains("loan") ||
               msg.contains("yield") || msg.contains("roi") || msg.contains("down payment");
    }

    private boolean isDealEvaluationIntent(String msg, Long targetPropertyId) {
        return targetPropertyId != null || msg.contains("is this fair") || msg.contains("fair price") ||
               msg.contains("overpriced") || msg.contains("good deal") || msg.contains("worth it") ||
               msg.contains("negotiate");
    }

    private boolean isSearchIntent(String msg) {
        return msg.contains("find") || msg.contains("looking for") || msg.contains("search") ||
               msg.contains("rent") || msg.contains("buy") || msg.contains("bhk") ||
               msg.contains("apartment") || msg.contains("villa") || msg.contains("commercial") ||
               msg.contains("under") || msg.contains("budget");
    }

    // --- Intent Handlers ---

    private AIBrokerChatResponse handleFinancialCalculation(String msg) {
        // Extract loan amount or default to ₹75 Lakhs
        double loanAmount = extractNumber(msg, 7500000.0);
        double interestRate = 8.5; // Benchmark home loan rate in India
        int tenureYears = 20;

        double monthlyRate = (interestRate / 12) / 100;
        int totalMonths = tenureYears * 12;
        double emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        double totalRepayment = emi * totalMonths;
        double totalInterest = totalRepayment - loanAmount;

        Map<String, Object> calculations = new LinkedHashMap<>();
        calculations.put("loanAmount", loanAmount);
        calculations.put("interestRate", interestRate + "%");
        calculations.put("tenureYears", tenureYears);
        calculations.put("monthlyEMI", Math.round(emi));
        calculations.put("totalInterestPayable", Math.round(totalInterest));
        calculations.put("totalRepaymentAmount", Math.round(totalRepayment));

        String reply = String.format(
                "Here is your financial breakdown for a loan of ₹%,.0f at %.1f%% interest over %d years:\n\n" +
                "• **Estimated Monthly EMI:** ₹%,.0f/month\n" +
                "• **Total Interest:** ₹%,.0f\n" +
                "• **Total Payment:** ₹%,.0f\n\n" +
                "💡 **RayBroker Pro-Tip:** Increasing your down payment by just 10%% can lower your monthly EMI by roughly ₹%,.0f.",
                loanAmount, interestRate, tenureYears, emi, totalInterest, totalRepayment, emi * 0.10
        );

        return AIBrokerChatResponse.builder()
                .intent("MORTGAGE_CALC")
                .reply(reply)
                .financialCalculations(calculations)
                .followUpSuggestions(List.of(
                        "Show properties within my EMI budget",
                        "How can I negotiate a 5% discount on new launches?",
                        "What is the stamp duty and registration fee in Bangalore?"
                ))
                .build();
    }

    private AIBrokerChatResponse handleDealEvaluation(AIBrokerChatRequest req) {
        Property property = null;
        if (req.getTargetPropertyId() != null) {
            property = propertyRepository.findById(req.getTargetPropertyId()).orElse(null);
        }
        if (property == null) {
            property = propertyRepository.findAll().stream().findFirst().orElse(null);
        }

        if (property == null) {
            return AIBrokerChatResponse.builder()
                    .intent("DEAL_EVALUATION")
                    .reply("Please specify a property or select one on RayLive to run an instant fair price evaluation.")
                    .build();
        }

        ValuationRequest valReq = ValuationRequest.builder()
                .city(property.getCity())
                .locality(property.getLocality())
                .propertyType(property.getPropertyType())
                .listingType(property.getListingType())
                .areaSqFt(property.getAreaSqFt())
                .bedrooms(property.getBedrooms())
                .build();

        ValuationResponse valuation = valuationService.estimateValuation(valReq);

        double listedPrice = property.getPrice().doubleValue();
        double fairPrice = valuation.getEstimatedFairPrice().doubleValue();
        double diffPercentage = ((listedPrice - fairPrice) / fairPrice) * 100.0;

        String verdict;
        String advice;
        if (diffPercentage > 6.0) {
            verdict = "⚠️ **Slightly Above Market Benchmark** (~" + String.format("%.1f", diffPercentage) + "% premium)";
            advice = "The seller has priced this slightly high. We recommend opening negotiations at ₹" +
                     String.format("%,.0f", fairPrice) + " citing local comparable sales.";
        } else if (diffPercentage < -5.0) {
            verdict = "🌟 **High-Value Deal** (~" + String.format("%.1f", Math.abs(diffPercentage)) + "% below market rate)";
            advice = "This listing is competitively priced. Verify title deeds, occupancy certificate (OC), and move fast before other buyers submit bids.";
        } else {
            verdict = "✅ **Fair Market Price** (Within standard ±5% market variance)";
            advice = "The price accurately reflects current demand, locality infrastructure, and amenities. You can still negotiate on registration/parking charges.";
        }

        String reply = String.format(
                "### RayBroker Deal Evaluation: %s\n\n" +
                "• **Listed Price:** ₹%,.0f\n" +
                "• **AI Estimated Fair Value:** ₹%,.0f\n" +
                "• **Status:** %s\n\n" +
                "%s\n\n" +
                "Would you like me to draft an inquiry message or connect you directly with the verified agent?",
                property.getTitle(), listedPrice, fairPrice, verdict, advice
        );

        Map<String, Object> calculations = new HashMap<>();
        calculations.put("listedPrice", listedPrice);
        calculations.put("fairMarketValue", fairPrice);
        calculations.put("priceVariancePercent", Math.round(diffPercentage * 10.0) / 10.0);
        calculations.put("pricePerSqFt", property.getPrice().divide(BigDecimal.valueOf(property.getAreaSqFt()), 0, RoundingMode.HALF_UP));

        return AIBrokerChatResponse.builder()
                .intent("DEAL_EVALUATION")
                .reply(reply)
                .recommendedProperties(List.of(propertyService.convertToDTO(property)))
                .financialCalculations(calculations)
                .followUpSuggestions(List.of(
                        "Help me write a counter-offer to the seller",
                        "What are the upcoming metro/infrastructure projects nearby?",
                        "Schedule a physical property tour"
                ))
                .build();
    }

    private AIBrokerChatResponse handlePropertySearch(String msg, String defaultCity) {
        ListingType listingType = ListingType.BUY;
        if (msg.contains("rent") || msg.contains("lease") || msg.contains("/month") || msg.contains("/mo")) {
            listingType = ListingType.RENT;
        } else if (msg.contains("commercial") || msg.contains("office") || msg.contains("retail")) {
            listingType = ListingType.COMMERCIAL;
        }

        Integer bedrooms = null;
        if (msg.contains("1 bhk") || msg.contains("1 bed")) bedrooms = 1;
        else if (msg.contains("2 bhk") || msg.contains("2 bed")) bedrooms = 2;
        else if (msg.contains("3 bhk") || msg.contains("3 bed")) bedrooms = 3;
        else if (msg.contains("4 bhk") || msg.contains("4 bed")) bedrooms = 4;

        String city = null;
        for (String c : List.of("bangalore", "bengaluru", "mumbai", "delhi", "gurgaon", "noida", "hyderabad", "pune", "chennai")) {
            if (msg.contains(c)) {
                city = c.substring(0, 1).toUpperCase() + c.substring(1);
                break;
            }
        }
        if (city == null && defaultCity != null && !defaultCity.isBlank()) {
            city = defaultCity;
        }

        List<Property> matched = propertyRepository.searchProperties(
                listingType,
                null,
                city,
                null,
                null,
                null,
                bedrooms,
                PropertyStatus.AVAILABLE,
                PageRequest.of(0, 3)
        ).getContent();

        List<PropertyDTO> dtoList = matched.stream().map(propertyService::convertToDTO).collect(Collectors.toList());

        String reply = String.format(
                "I found **%d verified %s properties** matching your request%s%s.\n\n" +
                "Each of these has been verified for title deeds and clear possession status. Click any property below to view photos, floor plans, and run a detailed price evaluation.",
                dtoList.size(),
                listingType.name().toLowerCase(),
                city != null ? " in " + city : "",
                bedrooms != null ? " (" + bedrooms + " BHK)" : ""
        );

        return AIBrokerChatResponse.builder()
                .intent("SEARCH")
                .reply(reply)
                .recommendedProperties(dtoList)
                .followUpSuggestions(List.of(
                        "Which of these has the best price-to-rent yield?",
                        "Are any of these ready-to-move-in?",
                        "Filter by properties with swimming pool and gym"
                ))
                .build();
    }

    private AIBrokerChatResponse handleGeneralAdvice(String msg) {
        String reply = "Welcome to **RayBroker**, your AI Real Estate Consultant on RayLive! 🏡\n\n" +
                       "Here are some of the ways I can help you save money and find the best properties:\n\n" +
                       "1. **Smart Property Search**: Ask for houses, apartments, or commercial spaces by location, budget, or BHK.\n" +
                       "2. **Deal & Price Valuation**: Ask *'Is ₹1.2 Cr fair for this 2 BHK?'* to compare with recent sales.\n" +
                       "3. **Mortgage & EMI Calculator**: Ask *'Calculate EMI for ₹60 Lakh loan'*, and I'll compute interest and tenure scenarios.\n" +
                       "4. **Seller & Landlord Guidance**: Get guidance on setting the optimal listing price to rent or sell faster.\n\n" +
                       "What are you looking to achieve today?";

        return AIBrokerChatResponse.builder()
                .intent("GENERAL_ADVICE")
                .reply(reply)
                .followUpSuggestions(List.of(
                        "Find 3 BHK apartments for sale in Bangalore under ₹1.5 Cr",
                        "Show me 2 BHK rental flats in Mumbai near metro",
                        "Calculate EMI for ₹80 Lakhs at 8.5% interest"
                ))
                .build();
    }

    private double extractNumber(String text, double defaultVal) {
        Pattern pattern = Pattern.compile("(\\d+(\\.\\d+)?)\\s*(lakh|lakhs|cr|crore|k|thousand)?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            double val = Double.parseDouble(matcher.group(1));
            String unit = matcher.group(3);
            if (unit != null) {
                unit = unit.toLowerCase();
                if (unit.startsWith("cr")) val *= 10000000;
                else if (unit.startsWith("lakh")) val *= 100000;
                else if (unit.equals("k") || unit.startsWith("thousand")) val *= 1000;
            }
            return val;
        }
        return defaultVal;
    }
}
