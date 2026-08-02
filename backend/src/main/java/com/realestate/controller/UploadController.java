package com.realestate.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/upload")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UploadController {

    private static final long MAX_IMAGE_BYTES = 10L * 1024 * 1024;   // 10 MB
    private static final long MAX_VIDEO_BYTES = 100L * 1024 * 1024;  // 100 MB

    private final Cloudinary cloudinary;

    @PostMapping
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("No file provided");
        }

        String contentType = file.getContentType() == null ? "" : file.getContentType();
        boolean isImage = contentType.startsWith("image/");
        boolean isVideo = contentType.startsWith("video/");

        if (!isImage && !isVideo) {
            throw new IllegalArgumentException("Only image and video files are allowed");
        }
        if (isImage && file.getSize() > MAX_IMAGE_BYTES) {
            throw new IllegalArgumentException("Images must be under 10MB");
        }
        if (isVideo && file.getSize() > MAX_VIDEO_BYTES) {
            throw new IllegalArgumentException("Videos must be under 100MB");
        }

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", isVideo ? "video" : "image",
                        "folder", "admani-homes"
                )
        );

        return Map.of(
                "url", String.valueOf(uploadResult.get("secure_url")),
                "resourceType", isVideo ? "video" : "image"
        );
    }
}
