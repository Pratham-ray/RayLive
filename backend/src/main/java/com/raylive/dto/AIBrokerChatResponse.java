package com.raylive.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIBrokerChatResponse {
    private String reply;
    private String intent; // "SEARCH", "DEAL_EVALUATION", "MORTGAGE_CALC", "GENERAL_ADVICE"
    private List<PropertyDTO> recommendedProperties;
    private Map<String, Object> financialCalculations; // e.g., EMI, rental yield, fair price estimation
    private List<String> followUpSuggestions;
}
