package com.realestate.dto;

import com.realestate.model.Partner;

public record PartnerResponse(
        Long id,
        String name,
        String logoUrl,
        Integer displayOrder,
        boolean active
) {
    public static PartnerResponse from(Partner p) {
        return new PartnerResponse(p.getId(), p.getName(), p.getLogoUrl(), p.getDisplayOrder(), p.isActive());
    }
}
