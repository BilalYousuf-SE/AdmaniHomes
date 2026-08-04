package com.realestate.controller;

import com.realestate.dto.ProjectRequest;
import com.realestate.dto.ProjectResponse;
import com.realestate.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // ---- Public endpoints (no auth required) ----

    @GetMapping
    public Page<ProjectResponse> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 12, sort = "createdAt") Pageable pageable) {
        return projectService.search(city, propertyType, keyword, pageable);
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable Long id) {
        return projectService.getById(id);
    }

    // ---- Admin-only endpoints ----

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<ProjectResponse> listAllForAdmin(@PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return projectService.listAllForAdmin(pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return projectService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }
}
