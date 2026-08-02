package com.realestate.service;

import com.realestate.dto.PartnerRequest;
import com.realestate.dto.PartnerResponse;
import com.realestate.exception.ResourceNotFoundException;
import com.realestate.model.Partner;
import com.realestate.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final PartnerRepository partnerRepository;

    @Transactional(readOnly = true)
    public List<PartnerResponse> listActive() {
        return partnerRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream().map(PartnerResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<PartnerResponse> listAllForAdmin() {
        return partnerRepository.findAll()
                .stream().map(PartnerResponse::from).toList();
    }

    @Transactional
    public PartnerResponse create(PartnerRequest request) {
        Partner partner = new Partner();
        apply(partner, request);
        return PartnerResponse.from(partnerRepository.save(partner));
    }

    @Transactional
    public PartnerResponse update(Long id, PartnerRequest request) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found: " + id));
        apply(partner, request);
        return PartnerResponse.from(partnerRepository.save(partner));
    }

    @Transactional
    public void delete(Long id) {
        if (!partnerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Partner not found: " + id);
        }
        partnerRepository.deleteById(id);
    }

    private void apply(Partner partner, PartnerRequest r) {
        partner.setName(r.getName().trim());
        partner.setLogoUrl(r.getLogoUrl());
        partner.setDisplayOrder(r.getDisplayOrder() != null ? r.getDisplayOrder() : 0);
        if (r.getActive() != null) {
            partner.setActive(r.getActive());
        }
    }
}
