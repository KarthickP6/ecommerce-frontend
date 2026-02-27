# Multi-stage Dockerfile for Spring Boot 3 Application with External PostgreSQL
# Uses entrypoint.sh for database readiness checks and signal handling

# Stage 1: Build
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /build

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (cached layer)
RUN ./mvnw dependency:resolve dependency:resolve-plugins

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy

LABEL maintainer="furniture-team"
LABEL version="2.0"
LABEL description="Spring Boot 3 Furniture E-Commerce Application with External DB"

# Install utilities for health checks and database readiness
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    netcat-openbsd \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built jar from builder stage (wildcard handles any finalName)
COPY --from=builder /build/target/*.jar app.jar

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

# JVM optimizations for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=25.0 \
    -XX:+UseG1GC \
    -XX:MaxGCPauseMillis=200 \
    -XX:+UnlockExperimentalVMOptions \
    -XX:G1NewCollectionHeuristicThresholdPercent=20 \
    -XX:G1MaxNewGenTaskPercent=30 \
    -Dfile.encoding=UTF-8 \
    -Duser.timezone=UTC"

# Database configuration defaults (override at runtime, never hardcode passwords)
ENV SPRING_DATASOURCE_HOST=localhost \
    SPRING_DATASOURCE_PORT=5432 \
    SPRING_DATASOURCE_DATABASE=furniture \
    SPRING_DATASOURCE_USERNAME=furniture_user \
    DB_WAIT_TIMEOUT=60 \
    SKIP_DB_CHECK=false

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/api/categories || exit 1

# Use entrypoint script for database readiness and signal handling
ENTRYPOINT ["/app/entrypoint.sh"]