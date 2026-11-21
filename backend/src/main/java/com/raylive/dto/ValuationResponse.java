package com.raylive.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValuationResponse {
    private BigDecimal estimatedFairPrice;
    private BigDecimal priceRangeLow;
    private BigDecimal priceRangeHigh;
    private Double estimatedPricePerSqFt;
    private String confidenceLevel; // "HIGH", "MODERATE", "ESTIMATED"
    private Double estimatedRentalYieldPercentage;
    private List<PropertyDTO> localComparableSales;
    private String valuationSummary;
}
