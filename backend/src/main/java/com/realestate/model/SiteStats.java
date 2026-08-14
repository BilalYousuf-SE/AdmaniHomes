package com.realestate.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "site_stats")
@Getter
@Setter
public class SiteStats {

    // Same singleton-row pattern as SiteSettings - only ever one row.
    @Id
    private Long id = 1L;

    private long totalVisits = 0L;
}
