package com.realestate.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Lightweight in-memory rate limiter, keyed by client IP, applied only to the
 * two public write endpoints that are attractive to abuse: lead submission
 * (spam) and admin login (brute force). This is intentionally simple - good
 * enough for a small deployment on a single instance. For multi-instance
 * deployments, swap this for a shared store (e.g. Redis).
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private record Window(AtomicInteger count, long windowStartEpochSec) {}

    private final Map<String, Window> buckets = new ConcurrentHashMap<>();

    private static final int LEAD_LIMIT = 5;      // max lead submissions per IP per window
    private static final int LOGIN_LIMIT = 10;    // max login attempts per IP per window
    private static final long WINDOW_SECONDS = 60;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        boolean isLeadPost = "POST".equalsIgnoreCase(request.getMethod()) && "/api/leads".equals(request.getRequestURI());
        boolean isLoginPost = "POST".equalsIgnoreCase(request.getMethod()) && "/api/auth/login".equals(request.getRequestURI());

        if (isLeadPost || isLoginPost) {
            String ip = clientIp(request);
            String key = (isLeadPost ? "lead:" : "login:") + ip;
            int limit = isLeadPost ? LEAD_LIMIT : LOGIN_LIMIT;

            if (isRateLimited(key, limit)) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests. Please try again in a minute.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(String key, int limit) {
        long now = Instant.now().getEpochSecond();
        Window window = buckets.compute(key, (k, existing) -> {
            if (existing == null || now - existing.windowStartEpochSec() >= WINDOW_SECONDS) {
                return new Window(new AtomicInteger(1), now);
            }
            existing.count().incrementAndGet();
            return existing;
        });
        return window.count().get() > limit;
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
