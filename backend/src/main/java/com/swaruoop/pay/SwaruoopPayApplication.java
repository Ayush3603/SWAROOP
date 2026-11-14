package com.swaruoop.pay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Swaruoop Pay - Main Application Entry Point
 * 
 * A Spring Boot backend for facial recognition payment system.
 * Provides REST APIs for authentication, banking, face enrollment,
 * and payment processing.
 * 
 * @author Swaruoop Pay Team
 */
@SpringBootApplication
public class SwaruoopPayApplication {

    public static void main(String[] args) {
        SpringApplication.run(SwaruoopPayApplication.class, args);
        System.out.println("========================================");
        System.out.println("Swaruoop Pay Backend started successfully!");
        System.out.println("Server port: 8080");
        System.out.println("H2 Console: http://localhost:8080/h2-console");
        System.out.println("Database URL: jdbc:h2:mem:swaruoop-pay");
        System.out.println("========================================");
    }
}
