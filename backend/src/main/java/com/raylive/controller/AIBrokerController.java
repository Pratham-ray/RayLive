package com.raylive.controller;

import com.raylive.dto.AIBrokerChatRequest;
import com.raylive.dto.AIBrokerChatResponse;
import com.raylive.dto.ValuationRequest;
import com.raylive.dto.ValuationResponse;
import com.raylive.service.AIBrokerService;
import com.raylive.service.ValuationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-broker")
@RequiredArgsConstructor
@Tag(name = "AI Broker", description = "Endpoints for conversational property advisory, deal evaluation, and financial calculations")
public class AIBrokerController {

    private final AIBrokerService aiBrokerService;
    private final ValuationService valuationService;

    @PostMapping("/chat")
    @Operation(summary = "Chat with RayBroker AI for property advice, search, and EMI calculations")
    public ResponseEntity<AIBrokerChatResponse> chat(@Valid @RequestBody AIBrokerChatRequest request) {
        return ResponseEntity.ok(aiBrokerService.chat(request));
    }

    @PostMapping("/valuation")
    @Operation(summary = "Calculate instant fair-market valuation and micro-market benchmark")
    public ResponseEntity<ValuationResponse> calculateValuation(@Valid @RequestBody ValuationRequest request) {
        return ResponseEntity.ok(valuationService.estimateValuation(request));
    }
}
