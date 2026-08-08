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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
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

    // NOTE: this must stay above /{id} - Spring matches the exact "/export"
    // path before falling back to the {id} pattern, but keeping it visually
    // grouped here avoids any future confusion about ordering.
    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportCsv() {
        List<LeadResponse> leads = leadService.listAllForExport();

        StringBuilder csv = new StringBuilder();
        csv.append("Name,Email,Phone,Project,Status,Message,Submitted\n");
        for (LeadResponse l : leads) {
            csv.append(escape(l.fullName())).append(',')
               .append(escape(l.email())).append(',')
               .append(escape(l.phone())).append(',')
               .append(escape(l.propertyTitle())).append(',')
               .append(escape(l.status() != null ? l.status().toString() : "")).append(',')
               .append(escape(l.message())).append(',')
               .append(l.createdAt() != null ? l.createdAt().toString() : "")
               .append('\n');
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"leads.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    private String escape(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
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
