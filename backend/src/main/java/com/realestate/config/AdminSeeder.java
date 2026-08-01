package com.realestate.config;

import com.realestate.model.AdminUser;
import com.realestate.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the first admin account on startup from environment variables,
 * if no admin with that username exists yet. This means the admin password
 * is never hard-coded in source control - it's supplied at deploy time via
 * ADMIN_USERNAME / ADMIN_PASSWORD env vars.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.seed-username:}")
    private String seedUsername;

    @Value("${app.admin.seed-password:}")
    private String seedPassword;

    @Override
    public void run(String... args) {
        if (seedUsername == null || seedUsername.isBlank() || seedPassword == null || seedPassword.isBlank()) {
            log.info("No ADMIN_USERNAME/ADMIN_PASSWORD provided - skipping admin seed.");
            return;
        }

        if (adminUserRepository.findByUsername(seedUsername).isPresent()) {
            return; // already seeded
        }

        AdminUser admin = new AdminUser();
        admin.setUsername(seedUsername);
        admin.setPasswordHash(passwordEncoder.encode(seedPassword));
        adminUserRepository.save(admin);
        log.info("Seeded initial admin user '{}'.", seedUsername);
    }
}
