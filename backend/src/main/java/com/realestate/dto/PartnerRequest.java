package com.realestate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PartnerRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String logoUrl;

    private Integer displayOrder;

    private Boolean active;
}
