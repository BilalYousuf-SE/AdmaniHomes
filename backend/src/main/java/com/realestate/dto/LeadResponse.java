package com.realestate.dto;

import com.realestate.model.Lead;
import com.realestate.model.LeadStatus;

import java.time.Instant;

public record LeadResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String message,
        Long propertyId,
        String propertyTitle,
        LeadStatus status,
        String adminNotes,
        Instant createdAt,
        Instant updatedAt
) {
    public static LeadResponse from(Lead l) {
        return new LeadResponse(
                l.getId(), l.getFullName(), l.getEmail(), l.getPhone(), l.getMessage(),
                l.getProperty() != null ? l.getProperty().getId() : null,
                l.getProperty() != null ? l.getProperty().getTitle() : null,
                l.getStatus(), l.getAdminNotes(), l.getCreatedAt(), l.getUpdatedAt()
        );
    }
}
