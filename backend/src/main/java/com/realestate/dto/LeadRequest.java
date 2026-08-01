package com.realestate.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeadRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 120, message = "Full name must be under 120 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "Phone number is required")
    // Accepts optional leading + and 7-15 digits, with optional spaces/dashes stripped by the client.
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Enter a valid phone number (7-15 digits, optional +country code)")
    private String phone;

    @Size(max = 1000, message = "Message must be under 1000 characters")
    private String message;

    private Long propertyId; // optional - null means a general enquiry
}
