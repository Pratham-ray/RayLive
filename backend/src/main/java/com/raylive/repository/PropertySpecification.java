package com.raylive.repository;

import com.raylive.entity.Property;
import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyStatus;
import com.raylive.entity.enums.PropertyType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> buildSearch(
            ListingType listingType,
            PropertyType propertyType,
            String city,
            String locality,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer bedrooms,
            String furnishingStatus,
            PropertyStatus status
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter by status
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            // Enum filters — use direct equality, no LOWER() needed
            if (listingType != null) {
                predicates.add(cb.equal(root.get("listingType"), listingType));
            }
            if (propertyType != null) {
                predicates.add(cb.equal(root.get("propertyType"), propertyType));
            }

            // String filters — use LOWER() safely on actual string columns
            if (city != null && !city.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.toLowerCase()));
            }
            if (locality != null && !locality.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("locality")), "%" + locality.toLowerCase() + "%"));
            }
            if (furnishingStatus != null && !furnishingStatus.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("furnishingStatus")), furnishingStatus.toLowerCase()));
            }

            // Numeric filters
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (bedrooms != null) {
                predicates.add(cb.equal(root.get("bedrooms"), bedrooms));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
