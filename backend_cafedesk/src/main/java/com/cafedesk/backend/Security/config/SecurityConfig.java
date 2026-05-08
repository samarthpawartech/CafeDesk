package com.cafedesk.backend.Security.config;

import com.cafedesk.backend.Security.jwt.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // ================= PASSWORD ENCODER =================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ================= CORS =================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);

        config.setAllowedOriginPatterns(List.of("*"));

        config.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        config.setAllowedHeaders(List.of("*"));

        config.setExposedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // ================= SECURITY FILTER =================

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

                // Disable CSRF
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                // Stateless JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ================= AUTH =================

                .authorizeHttpRequests(auth -> auth

                        // ===== PUBLIC ROUTES =====

                        .requestMatchers(
                                "/api/customer/login",
                                "/api/customer/register",
                                "/api/employee/login",
                                "/api/admin/login"
                        ).permitAll()

                        // ===== MENU =====

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/customer/menu"
                        ).permitAll()

                        .requestMatchers("/menu/**").permitAll()

                        // ===== CUSTOMER =====

                        .requestMatchers(
                                "/api/customer/place-order",
                                "/api/customer/feedback/**",
                                "/api/customer/orders/**"
                        ).permitAll()

                        // ===== PAYMENT =====

                        .requestMatchers("/api/payment/**").permitAll()

                        // ===== BILLS =====

                        .requestMatchers("/api/bills/**").permitAll()

                        // ===== EMPLOYEE =====

                        .requestMatchers(
                                "/api/employee/tables/**",
                                "/api/employee/orders/**"
                        ).permitAll()

                        // ================= INVENTORY FIX =================

                        .requestMatchers("/api/inventory/**").permitAll()

                        // ================= OPTIONS =================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // ===== PROTECTED =====

                        .requestMatchers("/api/admin/**").authenticated()

                        .requestMatchers("/api/employee/**").authenticated()

                        .requestMatchers("/api/customer/**").authenticated()

                        // ===== ANY =====

                        .anyRequest().authenticated()
                )

                // ================= ERROR HANDLER =================

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, ex2) ->
                                res.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "Unauthorized"
                                )
                        )
                )

                // ================= JWT FILTER =================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}