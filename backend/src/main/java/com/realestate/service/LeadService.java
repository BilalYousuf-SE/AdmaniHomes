package com.realestate.service;

import com.realestate.dto.LeadRequest;
import com.realestate.dto.LeadResponse;
import com.realestate.dto.LeadStatusUpdateRequest;
import com.realestate.exception.ResourceNotFoundException;
import com.realestate.model.Lead;
import com.realestate.model.LeadStatus;
import com.realestate.model.Project;
import com.realestate.repository.LeadRepository;
import com.realestate.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final ProjectRepository propertyRepository;

    @Transactional(readOnly = true)
    public List<LeadResponse> listAllForExport() {
        return leadRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(LeadResponse::from).toList();
    }

    @Transactional
    public void submitLead(LeadRequest request) {
        Lead lead = new Lead();
        lead.setFullName(request.getFullName().trim());
        lead.setEmail(request.getEmail().trim().toLowerCase());
        lead.setPhone(request.getPhone().trim());
        lead.setMessage(request.getMessage());
        lead.setStatus(LeadStatus.NEW);

        if (request.getPropertyId() != null) {
            Project property = propertyRepository.findById(request.getPropertyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + request.getPropertyId()));
            lead.setProperty(property);
        }

        leadRepository.save(lead);
        // No lead data is returned to the caller - only an acknowledgement -
        // so a public visitor can never enumerate or read back other people's leads.
    }

    @Transactional(readOnly = true)
    public Page<LeadResponse> list(LeadStatus status, Pageable pageable) {
        Page<Lead> page = status != null
                ? leadRepository.findByStatus(status, pageable)
                : leadRepository.findAll(pageable);
        return page.map(LeadResponse::from);
    }

    @Transactional(readOnly = true)
    public LeadResponse getById(Long id) {
        return LeadResponse.from(findLead(id));
    }

    @Transactional
    public LeadResponse updateStatus(Long id, LeadStatusUpdateRequest request) {
        Lead lead = findLead(id);
        lead.setStatus(request.getStatus());
        if (request.getAdminNotes() != null) {
            lead.setAdminNotes(request.getAdminNotes());
        }
        return LeadResponse.from(leadRepository.save(lead));
    }

    @Transactional
    public void delete(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead not found: " + id);
        }
        leadRepository.deleteById(id);
    }

    private Lead findLead(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found: " + id));
    }
}
