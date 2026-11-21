package com.raylive.controller;

import com.raylive.dto.InquiryRequest;
import com.raylive.dto.InquiryResponseDTO;
import com.raylive.entity.Inquiry;
import com.raylive.entity.Property;
import com.raylive.repository.InquiryRepository;
import com.raylive.repository.PropertyRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
@Tag(name = "Inquiries", description = "Endpoints for scheduling property tours and contacting agents")
public class InquiryController {

    private final InquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;

    @PostMapping
    @Operation(summary = "Submit a tour request or property contact inquiry")
    public ResponseEntity<InquiryResponseDTO> submitInquiry(@Valid @RequestBody InquiryRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + request.getPropertyId()));

        property.setInquiriesCount(property.getInquiriesCount() + 1);
        propertyRepository.save(property);

        Inquiry inquiry = Inquiry.builder()
                .property(property)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .message(request.getMessage())
                .preferredTourDate(request.getPreferredTourDate())
                .status("CONFIRMED")
                .build();

        Inquiry saved = inquiryRepository.save(inquiry);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(saved));
    }

    @GetMapping
    @Operation(summary = "Get inquiries, optionally filtered by user email")
    public ResponseEntity<List<InquiryResponseDTO>> getInquiries(@RequestParam(required = false) String email) {
        List<Inquiry> inquiries;
        if (email != null && !email.isBlank()) {
            inquiries = inquiryRepository.findByEmailIgnoreCaseOrderByCreatedAtDesc(email.trim());
        } else {
            inquiries = inquiryRepository.findAll();
        }

        List<InquiryResponseDTO> dtoList = inquiries.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel or delete a scheduled inquiry")
    public ResponseEntity<Void> cancelInquiry(@PathVariable Long id) {
        if (inquiryRepository.existsById(id)) {
            inquiryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private InquiryResponseDTO mapToDTO(Inquiry inquiry) {
        Property p = inquiry.getProperty();
        String primaryImage = (p.getImages() != null && !p.getImages().isEmpty())
                ? p.getImages().get(0)
                : null;

        String formattedPrice = (p.getPrice() != null)
                ? "₹" + p.getPrice().toPlainString()
                : "";

        return InquiryResponseDTO.builder()
                .id(inquiry.getId())
                .propertyId(p.getId())
                .propertyTitle(p.getTitle())
                .propertyCity(p.getCity())
                .propertyFormattedPrice(formattedPrice)
                .propertyImageUrl(primaryImage)
                .name(inquiry.getName())
                .email(inquiry.getEmail())
                .phone(inquiry.getPhone())
                .message(inquiry.getMessage())
                .preferredTourDate(inquiry.getPreferredTourDate())
                .status(inquiry.getStatus())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }
}
