package com.realestate.controller;

import com.realestate.dto.LeadRequest;
import com.realestate.dto.LeadResponse;
import com.realestate.dto.LeadStatusUpdateRequest;
import com.realestate.model.LeadStatus;
import com.realestate.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    // ---- Public endpoint: anyone can submit an enquiry, but cannot read leads back ----
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> submit(@Valid @RequestBody LeadRequest request) {
        leadService.submitLead(request);
        return Map.of("message", "Thanks! Our team will get back to you shortly.");
    }

    // ---- Admin-only endpoints ----

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<LeadResponse> list(
            @RequestParam(required = false) LeadStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        return leadService.list(status, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LeadResponse getById(@PathVariable Long id) {
        return leadService.getById(id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public LeadResponse updateStatus(@PathVariable Long id, @Valid @RequestBody LeadStatusUpdateRequest request) {
        return leadService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        leadService.delete(id);
    }
}
