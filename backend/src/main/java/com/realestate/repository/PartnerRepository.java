package com.realestate.repository;

import com.realestate.model.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    List<Partner> findByActiveTrueOrderByDisplayOrderAsc();
}
