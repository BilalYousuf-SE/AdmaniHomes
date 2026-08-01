package com.realestate.dto;

import com.realestate.model.LeadStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeadStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private LeadStatus status;

    private String adminNotes;
}
