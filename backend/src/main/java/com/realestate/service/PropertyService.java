package com.realestate.service;

import com.realestate.dto.PropertyRequest;
import com.realestate.dto.PropertyResponse;
import com.realestate.exception.ResourceNotFoundException;
import com.realestate.model.ListingType;
import com.realestate.model.Property;
import com.realestate.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    @Transactional(readOnly = true)
    public Page<PropertyResponse> search(String city, ListingType listingType, String propertyType,
                                          BigDecimal minPrice, BigDecimal maxPrice, String keyword,
                                          Pageable pageable) {
        return propertyRepository
                .search(blankToNull(city), listingType, blankToNull(propertyType), minPrice, maxPrice, blankToNull(keyword), pageable)
                .map(PropertyResponse::from);
    }

    @Transactional(readOnly = true)
    public PropertyResponse getById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + id));
        return PropertyResponse.from(property);
    }

    // Admin-only: includes inactive listings too.
    @Transactional(readOnly = true)
    public Page<PropertyResponse> listAllForAdmin(Pageable pageable) {
        return propertyRepository.findAll(pageable).map(PropertyResponse::from);
    }

    @Transactional
    public PropertyResponse create(PropertyRequest request) {
        Property property = new Property();
        applyRequest(property, request);
        return PropertyResponse.from(propertyRepository.save(property));
    }

    @Transactional
    public PropertyResponse update(Long id, PropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + id));
        applyRequest(property, request);
        return PropertyResponse.from(propertyRepository.save(property));
    }

    @Transactional
    public void delete(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Property not found: " + id);
        }
        propertyRepository.deleteById(id);
    }

    private void applyRequest(Property property, PropertyRequest r) {
        property.setTitle(r.getTitle().trim());
        property.setDescription(r.getDescription());
        property.setPrice(r.getPrice());
        property.setListingType(r.getListingType());
        property.setPropertyType(r.getPropertyType().trim());
        property.setCity(r.getCity().trim());
        property.setArea(r.getArea());
        property.setAddress(r.getAddress());
        property.setBedrooms(r.getBedrooms());
        property.setBathrooms(r.getBathrooms());
        property.setAreaSqft(r.getAreaSqft());
        property.setImageUrls(r.getImageUrls() != null ? r.getImageUrls() : new java.util.ArrayList<>());
        if (r.getActive() != null) {
            property.setActive(r.getActive());
        }
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
