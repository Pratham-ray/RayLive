package com.raylive.dto.auth;

import com.raylive.entity.enums.UserRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long id;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
    private String avatarUrl;
}
