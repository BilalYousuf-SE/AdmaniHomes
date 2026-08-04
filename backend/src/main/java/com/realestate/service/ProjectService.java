package com.realestate.service;

import com.realestate.dto.ProjectRequest;
import com.realestate.dto.ProjectResponse;
import com.realestate.exception.ResourceNotFoundException;
import com.realestate.model.Project;
import com.realestate.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public Page<ProjectResponse> search(String city, String propertyType, String keyword,
                                          Pageable pageable) {
        return projectRepository
                .search(blankToNull(city), blankToNull(propertyType), blankToNull(keyword), pageable)
                .map(ProjectResponse::from);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
        return ProjectResponse.from(project);
    }

    // Admin-only: includes inactive listings too.
    @Transactional(readOnly = true)
    public Page<ProjectResponse> listAllForAdmin(Pageable pageable) {
        return projectRepository.findAll(pageable).map(ProjectResponse::from);
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        Project project = new Project();
        applyRequest(project, request);
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
        applyRequest(project, request);
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found: " + id);
        }
        projectRepository.deleteById(id);
    }

    private void applyRequest(Project property, ProjectRequest r) {
        property.setTitle(r.getTitle().trim());
        property.setDescription(r.getDescription());
        property.setPropertyType(blankToNull(r.getPropertyType()));
        property.setCity(blankToNull(r.getCity()));
        property.setArea(r.getArea());
        property.setAddress(r.getAddress());
        property.setDeveloperName(r.getDeveloperName());
        property.setProjectStatus(r.getProjectStatus());
        property.setImageUrls(r.getImageUrls() != null ? r.getImageUrls() : new java.util.ArrayList<>());
        if (r.getActive() != null) {
            property.setActive(r.getActive());
        }
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
