package com.raylive.service;

import com.raylive.dto.PropertyCreateDTO;
import com.raylive.dto.PropertyDTO;
import com.raylive.dto.PropertySearchCriteria;
import com.raylive.entity.Agent;
import com.raylive.entity.Property;
import com.raylive.entity.enums.PropertyStatus;
import com.raylive.repository.AgentRepository;
import com.raylive.repository.PropertyRepository;
import com.raylive.repository.PropertySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final AgentRepository agentRepository;
    private final com.raylive.repository.UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<PropertyDTO> search(PropertySearchCriteria criteria) {
        Sort sort = switch (criteria.getSortBy()) {
            case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
            case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
            case "popular" -> Sort.by(Sort.Direction.DESC, "viewsCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);

        // Use JPA Specification to avoid lower(bytea) PostgreSQL bug with enum null params
        Specification<Property> spec = PropertySpecification.buildSearch(
                criteria.getListingType(),
                criteria.getPropertyType(),
                criteria.getCity(),
                criteria.getLocality(),
                criteria.getMinPrice(),
                criteria.getMaxPrice(),
                criteria.getBedrooms(),
                criteria.getFurnishingStatus(),
                PropertyStatus.AVAILABLE
        );

        return propertyRepository.findAll(spec, pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<PropertyDTO> getFeatured() {
        return propertyRepository.findByFeaturedTrueAndStatus(PropertyStatus.AVAILABLE)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PropertyDTO getById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        property.setViewsCount(property.getViewsCount() + 1);
        propertyRepository.save(property);
        return convertToDTO(property);
    }

    @Transactional
    public PropertyDTO create(PropertyCreateDTO dto) {
        Agent defaultAgent = agentRepository.findAll().stream().findFirst().orElse(null);

        com.raylive.entity.User owner = null;
        if (dto.getContactEmail() != null && !dto.getContactEmail().isBlank()) {
            owner = userRepository.findByEmail(dto.getContactEmail().trim()).orElse(null);
        }

        Property property = Property.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .listingType(dto.getListingType())
                .propertyType(dto.getPropertyType())
                .price(dto.getPrice())
                .rentFrequency(dto.getRentFrequency())
                .securityDeposit(dto.getSecurityDeposit())
                .maintenancePerMonth(dto.getMaintenancePerMonth())
                .areaSqFt(dto.getAreaSqFt())
                .bedrooms(dto.getBedrooms())
                .bathrooms(dto.getBathrooms())
                .balconies(dto.getBalconies())
                .furnishingStatus(dto.getFurnishingStatus())
                .parkingSpots(dto.getParkingSpots())
                .floorNumber(dto.getFloorNumber())
                .totalFloors(dto.getTotalFloors())
                .yearBuilt(dto.getYearBuilt())
                .address(dto.getAddress())
                .locality(dto.getLocality())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .latitude(dto.getLatitude() != null ? dto.getLatitude() : 12.9716) // Default fallback
                .longitude(dto.getLongitude() != null ? dto.getLongitude() : 77.5946)
                .amenities(dto.getAmenities() != null ? dto.getAmenities() : new ArrayList<>())
                .images(dto.getImages() != null && !dto.getImages().isEmpty() ? dto.getImages() : List.of(
                        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
                ))
                .agent(defaultAgent)
                .owner(owner)
                .status(PropertyStatus.AVAILABLE)
                .verified(false) // Pending admin review
                .featured(false)
                .build();

        Property saved = propertyRepository.save(property);
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getPropertyCountsByCity() {
        List<Object[]> results = propertyRepository.getPropertyCountsByCity();
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : results) {
            counts.put((String) row[0], (Long) row[1]);
        }
        return counts;
    }

    public PropertyDTO convertToDTO(Property p) {
        Double pricePerSqFt = (p.getAreaSqFt() != null && p.getAreaSqFt() > 0)
                ? p.getPrice().divide(BigDecimal.valueOf(p.getAreaSqFt()), 2, RoundingMode.HALF_UP).doubleValue()
                : null;

        PropertyDTO.AgentSummaryDTO agentSummary = null;
        if (p.getAgent() != null) {
            agentSummary = PropertyDTO.AgentSummaryDTO.builder()
                    .id(p.getAgent().getId())
                    .name(p.getAgent().getName())
                    .agencyName(p.getAgent().getAgencyName())
                    .phone(p.getAgent().getPhone())
                    .email(p.getAgent().getEmail())
                    .rating(p.getAgent().getRating())
                    .avatarUrl(p.getAgent().getAvatarUrl())
                    .verified(p.getAgent().getVerified())
                    .build();
        }

        return PropertyDTO.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .listingType(p.getListingType())
                .propertyType(p.getPropertyType())
                .status(p.getStatus())
                .price(p.getPrice())
                .formattedPrice(formatPrice(p.getPrice(), p.getListingType()))
                .rentFrequency(p.getRentFrequency())
                .securityDeposit(p.getSecurityDeposit())
                .maintenancePerMonth(p.getMaintenancePerMonth())
                .areaSqFt(p.getAreaSqFt())
                .pricePerSqFt(pricePerSqFt)
                .bedrooms(p.getBedrooms())
                .bathrooms(p.getBathrooms())
                .balconies(p.getBalconies())
                .furnishingStatus(p.getFurnishingStatus())
                .parkingSpots(p.getParkingSpots())
                .floorNumber(p.getFloorNumber())
                .totalFloors(p.getTotalFloors())
                .yearBuilt(p.getYearBuilt())
                .address(p.getAddress())
                .locality(p.getLocality())
                .city(p.getCity())
                .state(p.getState())
                .country(p.getCountry())
                .pincode(p.getPincode())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .amenities(p.getAmenities())
                .images(p.getImages())
                .verified(p.getVerified())
                .featured(p.getFeatured())
                .viewsCount(p.getViewsCount())
                .inquiriesCount(p.getInquiriesCount())
                .agent(agentSummary)
                .createdAt(p.getCreatedAt())
                .build();
    }

    private String formatPrice(BigDecimal price, com.raylive.entity.enums.ListingType listingType) {
        if (price == null) return "Price on Request";
        double val = price.doubleValue();
        if (listingType == com.raylive.entity.enums.ListingType.RENT) {
            return "₹" + NumberFormat.getIntegerInstance(new Locale("en", "IN")).format(val) + "/mo";
        }
        if (val >= 10000000) {
            return String.format("₹%.2f Cr", val / 10000000.0);
        } else if (val >= 100000) {
            return String.format("₹%.2f L", val / 100000.0);
        } else {
            return "₹" + NumberFormat.getIntegerInstance(new Locale("en", "IN")).format(val);
        }
    }
}
