package com.raylive.repository;

import com.raylive.entity.Property;
import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyStatus;
import com.raylive.entity.enums.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    List<Property> findByFeaturedTrueAndStatus(PropertyStatus status);

    Page<Property> findByListingTypeAndStatus(ListingType listingType, PropertyStatus status, Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.status = :status " +
           "AND (:listingType IS NULL OR p.listingType = :listingType) " +
           "AND (:propertyType IS NULL OR p.propertyType = :propertyType) " +
           "AND (:city IS NULL OR LOWER(p.city) = LOWER(:city)) " +
           "AND (:locality IS NULL OR LOWER(p.locality) LIKE LOWER(CONCAT('%', :locality, '%'))) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:bedrooms IS NULL OR p.bedrooms = :bedrooms)")
    Page<Property> searchProperties(
            @Param("listingType") ListingType listingType,
            @Param("propertyType") PropertyType propertyType,
            @Param("city") String city,
            @Param("locality") String locality,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("bedrooms") Integer bedrooms,
            @Param("status") PropertyStatus status,
            Pageable pageable
    );

    @Query("SELECT p.city, COUNT(p) FROM Property p WHERE p.status = 'AVAILABLE' GROUP BY p.city")
    List<Object[]> getPropertyCountsByCity();

    @Query("SELECT p FROM Property p WHERE p.city = :city AND p.propertyType = :type AND p.id <> :excludeId ORDER BY ABS(p.price - :targetPrice) ASC")
    List<Property> findComparableProperties(
            @Param("city") String city,
            @Param("type") PropertyType type,
            @Param("targetPrice") BigDecimal targetPrice,
            @Param("excludeId") Long excludeId,
            Pageable pageable
    );
}
