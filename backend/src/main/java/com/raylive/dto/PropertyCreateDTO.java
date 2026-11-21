package com.raylive.dto;

import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyType;
import com.raylive.entity.enums.RentFrequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyCreateDTO {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Listing type is required (BUY, RENT, COMMERCIAL)")
    private ListingType listingType;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private RentFrequency rentFrequency;

    private BigDecimal securityDeposit;
    private BigDecimal maintenancePerMonth;

    @NotNull(message = "Area in sqft is required")
    @Positive(message = "Area must be positive")
    private Double areaSqFt;

    private Integer bedrooms;
    private Integer bathrooms;
    private Integer balconies;
    private String furnishingStatus;
    private Integer parkingSpots;
    private Integer floorNumber;
    private Integer totalFloors;
    private Integer yearBuilt;

    private String address;

    @NotBlank(message = "Locality is required")
    private String locality;

    @NotBlank(message = "City is required")
    private String city;

    private String state;
    private String pincode;

    private Double latitude;
    private Double longitude;

    private List<String> amenities;
    private List<String> images;

    // Contact info for the listing owner/agent
    private String contactName;
    private String contactPhone;
    private String contactEmail;
}
