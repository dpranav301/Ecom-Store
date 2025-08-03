FROM openjdk:17-alpine
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} ecom.jar
ENTRYPOINT ["sh", "-c", "java -jar /ecom.jar --spring.profiles.active=${SPRING_PROFILES_ACTIVE}"]
