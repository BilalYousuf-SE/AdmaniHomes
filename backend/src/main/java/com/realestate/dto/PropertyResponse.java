package com.realestate.dto;

import com.realestate.model.ListingType;
import com.realestate.model.ProjectStatus;
import com.realestate.model.Property;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PropertyResponse(
        Long id,
        String title,
        String description,
        BigDecimal price,
        ListingType listingType,
        String propertyType,
        String city,
        String area,
        String address,
        Integer bedrooms,
        Integer bathrooms,
        Double areaSqft,
        String developerName,
        ProjectStatus projectStatus,
        List<String> imageUrls,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
    public static PropertyResponse from(Property p) {
        return new PropertyResponse(
                p.getId(), p.getTitle(), p.getDescription(), p.getPrice(), p.getListingType(),
                p.getPropertyType(), p.getCity(), p.getArea(), p.getAddress(),
                p.getBedrooms(), p.getBathrooms(), p.getAreaSqft(),
                p.getDeveloperName(), p.getProjectStatus(), p.getImageUrls(),
                p.isActive(), p.getCreatedAt(), p.getUpdatedAt()
        );
    }
}

