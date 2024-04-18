#building
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

#running
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
EXPOSE 8082
COPY --from=build /app/target/msystem-0.0.1-SNAPSHOT.jar ./
#ENV MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,refresh
HEALTHCHECK --start-period=60s --start-interval=2s CMD wget -T4 -qO- http://localhost:8080/actuator/health/liveness | grep UP || exit 1
ENTRYPOINT ["java", \
    "-Dspring.profiles.active=prod", \
    "-Dmanagement.endpoints.web.exposure.include=health,refresh", \
    "-Dmanagement.health.readiness-state.enabled=true", \
    "-Dmanagement.health.liveness-state.enabled=true", \
    "-Dmanagement.endpoint.health.probes.enabled=true", \
    "-jar", "msystem-0.0.1-SNAPSHOT.jar"]
