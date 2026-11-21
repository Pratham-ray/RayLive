package com.raylive.dto;

import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyStatus;
import com.raylive.entity.enums.PropertyType;
import com.raylive.entity.enums.RentFrequency;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyDTO {
    private Long id;
    private String title;
    private String description;
    private ListingType listingType;
    private PropertyType propertyType;
    private PropertyStatus status;
    private BigDecimal price;
    private String formattedPrice;
    private RentFrequency rentFrequency;
    private BigDecimal securityDeposit;
    private BigDecimal maintenancePerMonth;
    private Double areaSqFt;
    private Double pricePerSqFt;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer balconies;
    private String furnishingStatus;
    private Integer parkingSpots;
    private Integer floorNumber;
    private Integer totalFloors;
    private Integer yearBuilt;
    
    private String address;
    private String locality;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private Double latitude;
    private Double longitude;

    private List<String> amenities;
    private List<String> images;

    private Boolean verified;
    private Boolean featured;
    private Integer viewsCount;
    private Integer inquiriesCount;

    private AgentSummaryDTO agent;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AgentSummaryDTO {
        private Long id;
        private String name;
        private String agencyName;
        private String phone;
        private String email;
        private Double rating;
        private String avatarUrl;
        private Boolean verified;
    }
}
