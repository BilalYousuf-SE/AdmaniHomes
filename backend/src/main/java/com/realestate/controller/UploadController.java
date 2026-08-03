package com.realestate.controller;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Issues short-lived signatures that let the ADMIN'S BROWSER upload directly
 * to Cloudinary, bypassing our backend entirely. This is deliberate: relaying
 * large files (especially video) through a free-tier 512MB server risks
 * running out of memory. The backend never sees the file bytes here - it
 * only proves the request is authorized.
 */
@RestController
@RequestMapping("/api/admin/upload")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UploadController {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @GetMapping("/signature")
    public Map<String, Object> getUploadSignature() {
        long timestamp = System.currentTimeMillis() / 1000;

        Map<String, Object> paramsToSign = new LinkedHashMap<>();
        paramsToSign.put("timestamp", timestamp);
        paramsToSign.put("folder", "admani-homes");

        String signature = cloudinary.apiSignRequest(paramsToSign, cloudinary.config.apiSecret);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("signature", signature);
        response.put("timestamp", timestamp);
        response.put("apiKey", apiKey);
        response.put("cloudName", cloudName);
        response.put("folder", "admani-homes");
        return response;
    }
}
