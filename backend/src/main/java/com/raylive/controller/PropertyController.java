package com.raylive.controller;

import com.raylive.dto.PropertyCreateDTO;
import com.raylive.dto.PropertyDTO;
import com.raylive.dto.PropertySearchCriteria;
import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyType;
import com.raylive.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Tag(name = "Properties", description = "Endpoints for discovering, searching, and publishing real estate properties")
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    @Operation(summary = "Search and filter real estate listings")
    public ResponseEntity<Page<PropertyDTO>> searchProperties(
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) String furnishingStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sortBy
    ) {
        PropertySearchCriteria criteria = PropertySearchCriteria.builder()
                .listingType(listingType)
                .propertyType(propertyType)
                .city(city)
                .locality(locality)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .bedrooms(bedrooms)
                .furnishingStatus(furnishingStatus)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .build();

        return ResponseEntity.ok(propertyService.search(criteria));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full property details by ID")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getById(id));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured verified properties for homepage carousel")
    public ResponseEntity<List<PropertyDTO>> getFeaturedProperties() {
        return ResponseEntity.ok(propertyService.getFeatured());
    }

    @GetMapping("/city-counts")
    @Operation(summary = "Get active property counts grouped by city")
    public ResponseEntity<Map<String, Long>> getCityPropertyCounts() {
        return ResponseEntity.ok(propertyService.getPropertyCountsByCity());
    }

    @PostMapping
    @Operation(summary = "Publish a new property to Buy, Rent, or Commercial")
    public ResponseEntity<PropertyDTO> createProperty(@Valid @RequestBody PropertyCreateDTO dto) {
        PropertyDTO created = propertyService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
