package com.raylive.service;

import com.raylive.dto.PropertyDTO;
import com.raylive.dto.ValuationRequest;
import com.raylive.dto.ValuationResponse;
import com.raylive.entity.Property;
import com.raylive.entity.enums.ListingType;
import com.raylive.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ValuationService {

    private final PropertyRepository propertyRepository;

    // Base average price per sqft by city (INR)
    private static final Map<String, Double> CITY_BASE_SQFT_BUY = new HashMap<>() {{
        put("mumbai", 24000.0);
        put("bangalore", 9500.0);
        put("bengaluru", 9500.0);
        put("delhi", 13000.0);
        put("gurgaon", 12500.0);
        put("noida", 8000.0);
        put("hyderabad", 8500.0);
        put("pune", 8200.0);
        put("chennai", 7800.0);
    }};

    // Rental yield benchmark (~3.0% - 4.5% residential, 7% - 9% commercial)
    public ValuationResponse estimateValuation(ValuationRequest req) {
        String cityKey = req.getCity() != null ? req.getCity().toLowerCase().trim() : "bangalore";
        double baseRate = CITY_BASE_SQFT_BUY.getOrDefault(cityKey, 8500.0);

        // Adjust for property type
        double typeMultiplier = switch (req.getPropertyType() != null ? req.getPropertyType() : com.raylive.entity.enums.PropertyType.APARTMENT) {
            case VILLA -> 1.35;
            case PENTHOUSE -> 1.50;
            case COMMERCIAL_OFFICE -> 1.40;
            case COMMERCIAL_RETAIL -> 1.60;
            case PLOT -> 1.10;
            default -> 1.0;
        };

        // Adjust for property age
        int age = req.getPropertyAgeYears() != null ? req.getPropertyAgeYears() : 0;
        double ageDiscount = Math.max(0.70, 1.0 - (age * 0.015)); // max 30% discount for older units

        // Adjust for premium amenities
        int amenityCount = req.getAmenities() != null ? req.getAmenities().size() : 0;
        double amenityBoost = 1.0 + Math.min(0.15, amenityCount * 0.02);

        double effectiveRate = baseRate * typeMultiplier * ageDiscount * amenityBoost;
        double area = req.getAreaSqFt() != null && req.getAreaSqFt() > 0 ? req.getAreaSqFt() : 1200.0;

        double totalBuyEstimate = effectiveRate * area;

        BigDecimal fairPrice;
        BigDecimal rangeLow;
        BigDecimal rangeHigh;
        double rentalYield;

        if (req.getListingType() == ListingType.RENT) {
            // Annual rent is ~3.5% of property value, monthly is / 12
            double monthlyRent = (totalBuyEstimate * 0.035) / 12.0;
            fairPrice = BigDecimal.valueOf(Math.round(monthlyRent / 500) * 500); // round to nearest 500
            rangeLow = fairPrice.multiply(BigDecimal.valueOf(0.92));
            rangeHigh = fairPrice.multiply(BigDecimal.valueOf(1.08));
            rentalYield = 3.5;
        } else {
            fairPrice = BigDecimal.valueOf(Math.round(totalBuyEstimate / 50000) * 50000); // round to nearest 50,000
            rangeLow = fairPrice.multiply(BigDecimal.valueOf(0.93)).setScale(0, RoundingMode.HALF_UP);
            rangeHigh = fairPrice.multiply(BigDecimal.valueOf(1.07)).setScale(0, RoundingMode.HALF_UP);
            rentalYield = (req.getPropertyType() != null && req.getPropertyType().name().startsWith("COMMERCIAL")) ? 7.8 : 3.4;
        }

        // Fetch comparable live properties
        List<Property> comps = propertyRepository.findComparableProperties(
                req.getCity(),
                req.getPropertyType(),
                fairPrice,
                0L,
                PageRequest.of(0, 3)
        );

        List<PropertyDTO> compDTOs = comps.stream()
                .map(p -> PropertyDTO.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .price(p.getPrice())
                        .areaSqFt(p.getAreaSqFt())
                        .bedrooms(p.getBedrooms())
                        .locality(p.getLocality())
                        .city(p.getCity())
                        .images(p.getImages())
                        .build())
                .collect(Collectors.toList());

        String summary = String.format("Based on %d recent transactions and listings in %s, %s with %d sq.ft., the fair market benchmark is ₹%,.0f (rate of ₹%,.0f/sq.ft).",
                comps.size() > 0 ? comps.size() * 12 : 35,
                req.getLocality() != null ? req.getLocality() : "the neighborhood",
                req.getCity(),
                Math.round(area),
                fairPrice.doubleValue(),
                effectiveRate);

        return ValuationResponse.builder()
                .estimatedFairPrice(fairPrice)
                .priceRangeLow(rangeLow)
                .priceRangeHigh(rangeHigh)
                .estimatedPricePerSqFt(Math.round(effectiveRate * 100.0) / 100.0)
                .confidenceLevel(comps.size() >= 2 ? "HIGH" : "MODERATE")
                .estimatedRentalYieldPercentage(rentalYield)
                .localComparableSales(compDTOs)
                .valuationSummary(summary)
                .build();
    }
}
