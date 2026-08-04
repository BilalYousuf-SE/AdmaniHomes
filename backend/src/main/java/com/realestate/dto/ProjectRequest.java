package com.realestate.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be under 150 characters")
    private String title;

    @Size(max = 4000, message = "Description must be under 4000 characters")
    private String description;

    private String propertyType;

    private String city;

    private String area;

    @Size(max = 500)
    private String address;

    private String developerName;

    private com.realestate.model.ProjectStatus projectStatus;

    private List<@NotBlank String> imageUrls;

    private Boolean active;
}
