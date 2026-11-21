package com.raylive.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String agencyName;

    private String licenseNumber;

    @Builder.Default
    private Double rating = 4.8;

    @Builder.Default
    private Integer totalReviews = 0;

    @Builder.Default
    private Integer activeListingsCount = 0;

    @Builder.Default
    private Integer totalDeals = 0;

    @Column(length = 2000)
    private String bio;

    private String avatarUrl;

    @Builder.Default
    private Boolean verified = true;
}
