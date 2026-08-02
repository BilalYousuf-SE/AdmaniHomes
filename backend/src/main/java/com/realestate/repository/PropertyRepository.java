package com.realestate.repository;

import com.realestate.model.ListingType;
import com.realestate.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    Page<Property> findByActiveTrue(Pageable pageable);

    @Query("""
            SELECT p FROM Property p
            WHERE p.active = true
            AND (:city IS NULL OR LOWER(p.city) = LOWER(CAST(:city AS string)))
            AND (:listingType IS NULL OR p.listingType = :listingType)
            AND (:propertyType IS NULL OR LOWER(p.propertyType) = LOWER(CAST(:propertyType AS string)))
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
                 OR LOWER(p.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')))
            """)
    Page<Property> search(
            @Param("city") String city,
            @Param("listingType") ListingType listingType,
            @Param("propertyType") String propertyType,
            @Param("minPrice") java.math.BigDecimal minPrice,
            @Param("maxPrice") java.math.BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable);
}