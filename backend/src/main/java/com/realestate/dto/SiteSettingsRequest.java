package com.realestate.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SiteSettingsRequest {

    @Size(max = 2000, message = "Bio must be under 2000 characters")
    private String bio;

    private String realtorPhotoUrl;

    @Pattern(regexp = "^$|^\\+?[0-9]{7,15}$", message = "Enter a valid WhatsApp number (7-15 digits, optional +country code)")
    private String whatsappNumber;
}
