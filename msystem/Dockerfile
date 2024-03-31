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
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "msystem-0.0.1-SNAPSHOT.jar"]