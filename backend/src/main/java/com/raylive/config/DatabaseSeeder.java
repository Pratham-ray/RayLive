package com.raylive.config;

import com.raylive.entity.Agent;
import com.raylive.entity.Property;
import com.raylive.entity.User;
import com.raylive.entity.enums.ListingType;
import com.raylive.entity.enums.PropertyStatus;
import com.raylive.entity.enums.PropertyType;
import com.raylive.entity.enums.RentFrequency;
import com.raylive.entity.enums.UserRole;
import com.raylive.repository.AgentRepository;
import com.raylive.repository.PropertyRepository;
import com.raylive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final PropertyRepository propertyRepository;
    private final AgentRepository agentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Seed Demo Users for Authentication
        if (userRepository.count() == 0) {
            String encodedPass = passwordEncoder.encode("password123");

            User buyer = User.builder()
                    .name("Demo Buyer")
                    .email("buyer@raylive.in")
                    .password(encodedPass)
                    .phone("+91 98765 00001")
                    .role(UserRole.BUYER)
                    .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80")
                    .build();

            User owner = User.builder()
                    .name("Demo Owner")
                    .email("owner@raylive.in")
                    .password(encodedPass)
                    .phone("+91 98765 00002")
                    .role(UserRole.OWNER)
                    .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80")
                    .build();

            User agent = User.builder()
                    .name("Demo Agent")
                    .email("agent@raylive.in")
                    .password(encodedPass)
                    .phone("+91 98765 00003")
                    .role(UserRole.AGENT)
                    .avatarUrl("https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80")
                    .build();

            userRepository.saveAll(List.of(buyer, owner, agent));
        }

        if (agentRepository.count() > 0) return;

        // 2. Seed Agents
        Agent rajesh = Agent.builder()
                .name("Rajesh Malhotra")
                .email("rajesh.m@raylive.in")
                .phone("+91 98765 43210")
                .agencyName("RayLive Premier Advisory")
                .licenseNumber("RERA/KA/2021/004812")
                .rating(4.9)
                .totalReviews(124)
                .activeListingsCount(18)
                .totalDeals(210)
                .bio("Senior property advisor with 12+ years in East Bangalore & Whitefield luxury corridors.")
                .avatarUrl("https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80")
                .verified(true)
                .build();

        Agent pooja = Agent.builder()
                .name("Pooja Singhania")
                .email("pooja.s@raylive.in")
                .phone("+91 98200 11223")
                .agencyName("Coastal Luxury Estates")
                .licenseNumber("RERA/MH/2019/009134")
                .rating(5.0)
                .totalReviews(96)
                .activeListingsCount(12)
                .totalDeals(145)
                .bio("Bespoke residential broker representing high-net-worth buyers in Bandra, Worli, and Juhu.")
                .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80")
                .verified(true)
                .build();

        agentRepository.saveAll(List.of(rajesh, pooja));

        // 3. Seed Initial Properties
        Property p1 = Property.builder()
                .title("Prestige Lakeside Luxury Residences")
                .description("Ultra-luxury 3 BHK apartment overlooking the serene lake with Italian marble and smart home controls.")
                .listingType(ListingType.BUY)
                .propertyType(PropertyType.APARTMENT)
                .status(PropertyStatus.AVAILABLE)
                .price(BigDecimal.valueOf(18500000))
                .rentFrequency(RentFrequency.NOT_APPLICABLE)
                .areaSqFt(1980.0)
                .bedrooms(3)
                .bathrooms(3)
                .balconies(2)
                .furnishingStatus("Semi-Furnished")
                .parkingSpots(2)
                .locality("Whitefield")
                .city("Bangalore")
                .state("Karnataka")
                .country("India")
                .latitude(12.9698)
                .longitude(77.7499)
                .amenities(List.of("Infinity Swimming Pool", "Gym", "Clubhouse", "24/7 Security", "EV Charging"))
                .images(List.of(
                        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                ))
                .verified(true)
                .featured(true)
                .viewsCount(1420)
                .agent(rajesh)
                .build();

        Property p2 = Property.builder()
                .title("Skyline Sea-Facing Penthouse")
                .description("Exclusive duplex penthouse with uninterrupted Arabian Sea views, private plunge pool, and elevator access.")
                .listingType(ListingType.BUY)
                .propertyType(PropertyType.PENTHOUSE)
                .status(PropertyStatus.AVAILABLE)
                .price(BigDecimal.valueOf(65000000))
                .rentFrequency(RentFrequency.NOT_APPLICABLE)
                .areaSqFt(4200.0)
                .bedrooms(4)
                .bathrooms(5)
                .balconies(3)
                .furnishingStatus("Fully-Furnished")
                .parkingSpots(3)
                .locality("Bandra West")
                .city("Mumbai")
                .state("Maharashtra")
                .country("India")
                .latitude(19.0607)
                .longitude(72.8258)
                .amenities(List.of("Private Plunge Pool", "Private Elevator", "Terrace Garden", "Concierge Service", "24/7 Security"))
                .images(List.of(
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                ))
                .verified(true)
                .featured(true)
                .viewsCount(2890)
                .agent(pooja)
                .build();

        Property p3 = Property.builder()
                .title("Contemporary Minimalist 2 BHK Flat")
                .description("Bright and airy modern flat in the heart of Indiranagar. Walking distance to 100ft road cafes.")
                .listingType(ListingType.RENT)
                .propertyType(PropertyType.APARTMENT)
                .status(PropertyStatus.AVAILABLE)
                .price(BigDecimal.valueOf(48000))
                .rentFrequency(RentFrequency.MONTHLY)
                .securityDeposit(BigDecimal.valueOf(200000))
                .areaSqFt(1250.0)
                .bedrooms(2)
                .bathrooms(2)
                .balconies(1)
                .furnishingStatus("Semi-Furnished")
                .parkingSpots(1)
                .locality("Indiranagar")
                .city("Bangalore")
                .state("Karnataka")
                .country("India")
                .latitude(12.9719)
                .longitude(77.6412)
                .amenities(List.of("Covered Car Parking", "Power Backup", "Lift", "Gated Community"))
                .images(List.of(
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
                ))
                .verified(true)
                .featured(false)
                .viewsCount(890)
                .agent(rajesh)
                .build();

        propertyRepository.saveAll(List.of(p1, p2, p3));
    }
}
