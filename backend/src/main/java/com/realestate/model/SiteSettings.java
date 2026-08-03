package com.realestate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
public class SiteSettings {

    // Deliberately always 1 - this table only ever holds a single row,
    // since there's one realtor/business behind the whole site.
    @Id
    private Long id = 1L;

    @Column(length = 2000)
    private String bio;

    @Column(length = 1000)
    private String realtorPhotoUrl;

    @Column(length = 30)
    private String whatsappNumber;
}
