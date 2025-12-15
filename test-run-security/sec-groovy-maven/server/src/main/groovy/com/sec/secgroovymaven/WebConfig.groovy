package com.sec.secgroovymaven

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig implements WebMvcConfigurer {
    @Override
    void addCorsMappings(CorsRegistry registry) {
        registry.addMapping('/**')
                .allowedOrigins('http://localhost:5173', 'http://localhost:3000')
                .allowedMethods('GET','POST','PUT','DELETE','OPTIONS')
                .allowedHeaders('*')
                .allowCredentials(true)
    }
}
