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

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        /* ================= PUBLIC ================= */

                        // Authentication
                        .requestMatchers(
                                "/api/customer/register",
                                "/api/customer/login",
                                "/api/employee/login",
                                "/api/admin/login"
                        ).permitAll()

                        // Public Menu API
                        .requestMatchers(HttpMethod.GET, "/api/customer/menu").permitAll()

                        // ✅ Important: Allow image access
                        .requestMatchers("/menu/**").permitAll()

                        // Preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Swagger
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        /* ================= ADMIN ================= */
                        .requestMatchers("/api/admin/**").authenticated()

                        /* ================= EMPLOYEE ================= */
                        .requestMatchers("/api/employee/**").authenticated()

                        /* ================= CUSTOMER ================= */

                        // Temporarily allow place-order for dev testing
                        .requestMatchers("/api/customer/place-order").permitAll()

                        // Other customer endpoints require authentication
                        .requestMatchers("/api/customer/**").authenticated()

                        /* ================= FALLBACK ================= */
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "Unauthorized"
                                )
                        )
                )
                // JWT Filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}