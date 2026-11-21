package com.raylive.service;

import com.raylive.entity.Agent;
import com.raylive.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepository agentRepository;

    @Transactional(readOnly = true)
    public List<Agent> getVerifiedAgents() {
        return agentRepository.findByVerifiedTrueOrderByRatingDesc();
    }

    @Transactional(readOnly = true)
    public Agent getById(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found with id: " + id));
    }
}
