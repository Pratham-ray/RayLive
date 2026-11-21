package com.raylive.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI rayLiveOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("RayLive Real Estate Marketplace API")
                        .description("Backend REST APIs for RayLive — PropTech marketplace with AI Property Consultant, real-time discovery, and fair price valuation.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("RayLive Engineering")
                                .email("engineering@raylive.in")
                                .url("https://raylive.in"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")));
    }
}
