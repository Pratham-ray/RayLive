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
public class ValuationRequest {
    private String city;
    private String locality;
    private PropertyType propertyType;
    private ListingType listingType;
    private Double areaSqFt;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer propertyAgeYears;
    private List<String> amenities;
}
