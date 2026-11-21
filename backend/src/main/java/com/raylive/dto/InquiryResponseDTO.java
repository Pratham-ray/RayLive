package com.raylive.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryResponseDTO {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyCity;
    private String propertyFormattedPrice;
    private String propertyImageUrl;
    private String name;
    private String email;
    private String phone;
    private String message;
    private LocalDate preferredTourDate;
    private String status;
    private LocalDateTime createdAt;
}
