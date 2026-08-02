package com.realestate.controller;

import com.realestate.dto.PartnerRequest;
import com.realestate.dto.PartnerResponse;
import com.realestate.service.PartnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    // Public - powers the "We're working with" strip
    @GetMapping
    public List<PartnerResponse> listActive() {
        return partnerService.listActive();
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PartnerResponse> listAllForAdmin() {
        return partnerService.listAllForAdmin();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public PartnerResponse create(@Valid @RequestBody PartnerRequest request) {
        return partnerService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PartnerResponse update(@PathVariable Long id, @Valid @RequestBody PartnerRequest request) {
        return partnerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        partnerService.delete(id);
    }
}
