package com.cafedesk.backend.Security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        // ✅ Allow preflight (CORS)
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        // ✅ PUBLIC ENDPOINTS (NO JWT REQUIRED)
        return path.startsWith("/api/customer/login")
                || path.startsWith("/api/customer/register")
                || path.startsWith("/api/customer/menu")
                || path.startsWith("/api/employee/login")
                || path.startsWith("/api/admin/login")
                || path.startsWith("/api/bills")   // ✅ ADD THIS LINE (IMPORTANT)
                || path.startsWith("/api/payment"); // (optional if needed)
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // ✅ No token → allow request (do NOT block)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);

        try {
            String username = jwtUtil.extractUsername(jwt);

            if (username != null && jwtUtil.validateToken(jwt)) {

                String role = jwtUtil.extractRole(jwt);

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                Collections.singletonList(authority)
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (Exception e) {
            // ❌ DON'T BLOCK REQUEST FOR PUBLIC APIs
            SecurityContextHolder.clearContext();

            // Optional: comment this if still issue
            // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT Failed");
            // return;
        }

        filterChain.doFilter(request, response);
    }
}