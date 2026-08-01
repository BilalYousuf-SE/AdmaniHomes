package com.realestate.controller;

import com.realestate.dto.LoginRequest;
import com.realestate.dto.LoginResponse;
import com.realestate.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            // Deliberately vague - do not reveal whether the username exists.
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(request.getUsername());
        return new LoginResponse(token, request.getUsername(), jwtUtil.getExpirationMs());
    }
}
