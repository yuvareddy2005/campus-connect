package com.campusconnect.campus_connect.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.campusconnect.campus_connect.entity.Event;

import jakarta.persistence.criteria.Predicate;

public class EventSpecification {

    public static Specification<Event> findByCriteria(String keyword) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String keywordPattern = "%" + keyword.toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), keywordPattern);
                Predicate descriptionPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), keywordPattern);
                
                predicates.add(criteriaBuilder.or(namePredicate, descriptionPredicate));
            }

            // More predicates for date, location, etc., can be added here later
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}