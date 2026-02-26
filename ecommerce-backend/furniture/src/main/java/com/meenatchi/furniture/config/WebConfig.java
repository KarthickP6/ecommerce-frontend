package com.meenatchi.furniture.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration
 * Spring Boot default behavior is sufficient for API routing
 * No custom resource handlers needed
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // Empty - using Spring Boot defaults which properly route /api/** to controllers
}

