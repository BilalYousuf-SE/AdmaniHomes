package com.realestate.controller;

import com.realestate.dto.PropertyRequest;
import com.realestate.dto.PropertyResponse;
import com.realestate.model.ListingType;
import com.realestate.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    // ---- Public endpoints (no auth required) ----

    @GetMapping
    public Page<PropertyResponse> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 12, sort = "createdAt") Pageable pageable) {
        return propertyService.search(city, listingType, propertyType, minPrice, maxPrice, keyword, pageable);
    }

    @GetMapping("/{id}")
    public PropertyResponse getById(@PathVariable Long id) {
        return propertyService.getById(id);
    }

    // ---- Admin-only endpoints ----

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<PropertyResponse> listAllForAdmin(@PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return propertyService.listAllForAdmin(pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public PropertyResponse create(@Valid @RequestBody PropertyRequest request) {
        return propertyService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PropertyResponse update(@PathVariable Long id, @Valid @RequestBody PropertyRequest request) {
        return propertyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        propertyService.delete(id);
    }
}
