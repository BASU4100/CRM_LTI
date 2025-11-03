package com.wecp.car_rental_management_system.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// file for declaring beans
@Configuration
public class Configurations {


    @Value("${file.upload-dir}")
        private String uploadDir;

    // bean for password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // // bean for cors
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("POST", "GET", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
                    @Override
                    public void addResourceHandlers(ResourceHandlerRegistry registry) {
                        // Map /images/** to the file system upload directory
                        registry.addResourceHandler("/images/**")
                                .addResourceLocations("file:" + uploadDir);
                    }
                };
        };
    }
    

