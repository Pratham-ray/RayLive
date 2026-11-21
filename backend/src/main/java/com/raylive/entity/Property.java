package com.raylive.entity;

import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyStatus;
import com.raylive.entity.enums.PropertyType;
import com.raylive.entity.enums.RentFrequency;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 4000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType listingType; // BUY, RENT, COMMERCIAL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType propertyType; // APARTMENT, VILLA, PENTHOUSE, etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PropertyStatus status = PropertyStatus.AVAILABLE;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price; // Total purchase price or monthly rent

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RentFrequency rentFrequency = RentFrequency.NOT_APPLICABLE;

    @Column(precision = 12, scale = 2)
    private BigDecimal securityDeposit;

    @Column(precision = 10, scale = 2)
    private BigDecimal maintenancePerMonth;

    @Column(nullable = false)
    private Double areaSqFt;

    private Integer bedrooms;

    private Integer bathrooms;

    private Integer balconies;

    private String furnishingStatus; // Unfurnished, Semi-Furnished, Fully-Furnished

    private Integer parkingSpots;

    private Integer floorNumber;

    private Integer totalFloors;

    private Integer yearBuilt;

    // Location & Geo Information
    private String address;

    @Column(nullable = false)
    private String locality;

    @Column(nullable = false)
    private String city;

    private String state;

    @Builder.Default
    private String country = "India";

    private String pincode;

    private Double latitude;

    private Double longitude;

    // Rich collections
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    @Builder.Default
    private List<String> amenities = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    // Trust & Engagement
    @Builder.Default
    private Boolean verified = true;

    @Builder.Default
    private Boolean featured = false;

    @Builder.Default
    private Integer viewsCount = 0;

    @Builder.Default
    private Integer inquiriesCount = 0;

    // Relationships
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agent_id")
    private Agent agent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
