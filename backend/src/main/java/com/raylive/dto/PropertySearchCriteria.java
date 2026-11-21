package com.raylive.dto;

import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyType;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertySearchCriteria {
    private ListingType listingType; // BUY, RENT, COMMERCIAL
    private PropertyType propertyType; // APARTMENT, VILLA, etc.
    private String city;
    private String locality;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer bedrooms;
    private List<String> amenities;
    private String furnishingStatus;
    
    @Builder.Default
    private int page = 0;
    
    @Builder.Default
    private int size = 12;
    
    @Builder.Default
    private String sortBy = "newest"; // newest, priceAsc, priceDesc, popular
}
