package com.realestate.dto;

import com.realestate.model.ListingType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class PropertyRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be under 150 characters")
    private String title;

    @Size(max = 4000, message = "Description must be under 4000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private BigDecimal price;

    @NotNull(message = "Listing type is required")
    private ListingType listingType;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    @NotBlank(message = "City is required")
    private String city;

    private String area;

    @Size(max = 500)
    private String address;

    @PositiveOrZero
    private Integer bedrooms;

    @PositiveOrZero
    private Integer bathrooms;

    @PositiveOrZero
    private Double areaSqft;

    private List<@NotBlank String> imageUrls;

    private Boolean active;
}
