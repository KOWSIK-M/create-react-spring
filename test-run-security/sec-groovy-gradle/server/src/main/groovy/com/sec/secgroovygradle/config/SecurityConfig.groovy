package com.sec.secgroovygradle.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import static org.springframework.security.config.Customizer.withDefaults

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests { authz ->
                authz.anyRequest().authenticated()
            }
            .httpBasic(withDefaults())
            .csrf { csrf -> csrf.disable() } // Disabled for easier API testing
        return http.build()
    }
}
