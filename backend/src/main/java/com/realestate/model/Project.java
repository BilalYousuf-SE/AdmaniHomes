package com.realestate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 4000)
    private String description;

    private String propertyType; // House, Apartment, Plot, Commercial...

    @Column
    private String city;

    @Column
    private String area;

    @Column(length = 500)
    private String address;

    private String developerName;

    @Enumerated(EnumType.STRING)
    private ProjectStatus projectStatus; // OFF_PLAN or READY - nullable, only meaningful for "project" style listings

    @ElementCollection
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url", length = 1000)
    private List<String> imageUrls = new ArrayList<>();

    @Column(nullable = false)
    private boolean active = true; // soft flag, so admin can hide without deleting

    @Column(updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
