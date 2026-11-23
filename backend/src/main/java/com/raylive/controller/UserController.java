package com.raylive.controller;

import com.raylive.dto.PropertyDTO;
import com.raylive.entity.Property;
import com.raylive.entity.User;
import com.raylive.repository.PropertyRepository;
import com.raylive.repository.UserRepository;
import com.raylive.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile & Data", description = "Endpoints for managing persistent multi-device user favorites and listings")
public class UserController {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyService propertyService;

    @GetMapping("/favorites")
    @Operation(summary = "Get current user's saved favorite property IDs from PostgreSQL")
    public ResponseEntity<?> getFavorites(
            @AuthenticationPrincipal User authUser,
            @RequestParam(required = false) String email
    ) {
        User user = resolveUser(authUser, email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User authentication required"));
        }

        // Fetch fresh state from PostgreSQL
        User fresh = userRepository.findById(user.getId()).orElse(user);
        return ResponseEntity.ok(fresh.getFavoritePropertyIds());
    }

    @GetMapping("/favorites/details")
    @Operation(summary = "Get full property details of all properties saved in user's favorites")
    public ResponseEntity<?> getFavoritePropertyDetails(
            @AuthenticationPrincipal User authUser,
            @RequestParam(required = false) String email
    ) {
        User user = resolveUser(authUser, email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User authentication required"));
        }

        User fresh = userRepository.findById(user.getId()).orElse(user);
        Set<Long> ids = fresh.getFavoritePropertyIds();
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Property> properties = propertyRepository.findByIdIn(ids);
        List<PropertyDTO> dtos = properties.stream()
                .map(propertyService::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/favorites/{propertyId}")
    @Operation(summary = "Save property to user favorites in PostgreSQL (syncs across all devices)")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal User authUser,
            @RequestParam(required = false) String email
    ) {
        User user = resolveUser(authUser, email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User authentication required"));
        }

        User fresh = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        fresh.getFavoritePropertyIds().add(propertyId);
        userRepository.save(fresh);

        log.info("User {} added property {} to PostgreSQL favorites (total: {})",
                fresh.getEmail(), propertyId, fresh.getFavoritePropertyIds().size());

        return ResponseEntity.ok(fresh.getFavoritePropertyIds());
    }

    @DeleteMapping("/favorites/{propertyId}")
    @Operation(summary = "Remove property from user favorites in PostgreSQL")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal User authUser,
            @RequestParam(required = false) String email
    ) {
        User user = resolveUser(authUser, email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User authentication required"));
        }

        User fresh = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        fresh.getFavoritePropertyIds().remove(propertyId);
        userRepository.save(fresh);

        log.info("User {} removed property {} from PostgreSQL favorites", fresh.getEmail(), propertyId);

        return ResponseEntity.ok(fresh.getFavoritePropertyIds());
    }

    @GetMapping("/my-listings")
    @Operation(summary = "Get all properties owned or listed by current user")
    public ResponseEntity<?> getMyListings(
            @AuthenticationPrincipal User authUser,
            @RequestParam(required = false) String email
    ) {
        User user = resolveUser(authUser, email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User authentication required"));
        }

        List<Property> properties = propertyRepository.findUserProperties(user.getId(), user.getEmail());
        List<PropertyDTO> dtos = properties.stream()
                .map(propertyService::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private User resolveUser(User authUser, String emailFallback) {
        if (authUser != null) {
            return authUser;
        }
        if (emailFallback != null && !emailFallback.isBlank()) {
            return userRepository.findByEmail(emailFallback.trim()).orElse(null);
        }
        return null;
    }
}
