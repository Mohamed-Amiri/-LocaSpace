package org.example.locaspace.repository;

import jakarta.persistence.criteria.Predicate;
import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.enums.LieuType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class LieuSpecifications {
    
    public static Specification<Lieu> withFilters(
            LieuType type, BigDecimal minPrix, BigDecimal maxPrix, String ville) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Only validated lieux
            predicates.add(cb.isTrue(root.get("valide")));

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            
            if (minPrix != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("prix"), minPrix));
            }
            
            if (maxPrix != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("prix"), maxPrix));
            }
            
            if (ville != null && !ville.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("adresse")),
                    "%" + ville.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
