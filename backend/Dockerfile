# Multi-stage Docker build for RayLive Spring Boot Backend
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
# Pre-download dependencies
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Minimal production runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S raylive && adduser -S raylive -G raylive
USER raylive

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
