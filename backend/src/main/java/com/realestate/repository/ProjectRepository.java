package com.realestate.repository;

import com.realestate.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Page<Project> findByActiveTrue(Pageable pageable);

    @Query("""
            SELECT p FROM Project p
            WHERE p.active = true
            AND (:city IS NULL OR LOWER(p.city) = LOWER(CAST(:city AS string)))
            AND (:propertyType IS NULL OR LOWER(p.propertyType) = LOWER(CAST(:propertyType AS string)))
            AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
                 OR LOWER(p.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')))
            """)
    Page<Project> search(
            @Param("city") String city,
            @Param("propertyType") String propertyType,
            @Param("keyword") String keyword,
            Pageable pageable);
}
