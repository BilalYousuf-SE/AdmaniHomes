package com.realestate.dto;

public record LoginResponse(String token, String username, long expiresInMs) {
}
