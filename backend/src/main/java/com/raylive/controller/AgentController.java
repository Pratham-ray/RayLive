package com.raylive.controller;

import com.raylive.entity.Agent;
import com.raylive.service.AgentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
@Tag(name = "Agents", description = "Endpoints for verified human real-estate brokers")
public class AgentController {

    private final AgentService agentService;

    @GetMapping
    @Operation(summary = "Get list of all verified real-estate agents")
    public ResponseEntity<List<Agent>> getAllAgents() {
        return ResponseEntity.ok(agentService.getVerifiedAgents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get agent profile by ID")
    public ResponseEntity<Agent> getAgentById(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getById(id));
    }
}
