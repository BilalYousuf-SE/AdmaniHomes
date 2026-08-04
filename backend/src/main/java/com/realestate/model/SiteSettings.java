package com.realestate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
public class SiteSettings {

    // Deliberately always 1 - this table only ever holds a single row,
    // since there's one realtor/business behind the whole site.
    @Id
    private Long id = 1L;

    @Column(length = 150)
    private String realtorName;

    @Column(length = 250)
    private String realtorTitle;

    @Column(length = 2000)
    private String bio;

    @Column(length = 1000)
    private String mission;

    @ElementCollection
    @CollectionTable(name = "site_settings_expertise", joinColumns = @JoinColumn(name = "settings_id"))
    @Column(name = "item", length = 150)
    private List<String> expertise = new ArrayList<>();

    @Column(length = 1000)
    private String realtorPhotoUrl;

    @Column(length = 30)
    private String whatsappNumber;
}