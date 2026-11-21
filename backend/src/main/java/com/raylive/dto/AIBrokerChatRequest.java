package com.raylive.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIBrokerChatRequest {
    private String message;
    private String conversationId;
    private Long targetPropertyId; // Optional: if the user is asking about a specific property
    private String preferredCity;
}
