package com.realestate.dto;

import com.realestate.model.ProjectStatus;
import com.realestate.model.Project;

import java.time.Instant;
import java.util.List;

public record ProjectResponse(
        Long id,
        String title,
        String description,
        String propertyType,
        String city,
        String area,
        String address,
        String developerName,
        ProjectStatus projectStatus,
        List<String> imageUrls,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
    public static ProjectResponse from(Project p) {
        return new ProjectResponse(
                p.getId(), p.getTitle(), p.getDescription(),
                p.getPropertyType(), p.getCity(), p.getArea(), p.getAddress(),
                p.getDeveloperName(), p.getProjectStatus(), p.getImageUrls(),
                p.isActive(), p.getCreatedAt(), p.getUpdatedAt()
        );
    }
}

