package com.campusconnect.campus_connect.specification;

import com.campusconnect.campus_connect.entity.Event;
import com.campusconnect.campus_connect.entity.Tag;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class EventSpecification {

    public static Specification<Event> findByCriteria(String keyword, String tagName) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String keywordPattern = "%" + keyword.toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), keywordPattern);
                Predicate descriptionPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")),
                        keywordPattern);
                predicates.add(criteriaBuilder.or(namePredicate, descriptionPredicate));
            }

            if (tagName != null && !tagName.trim().isEmpty()) {
                Join<Event, Tag> tagsJoin = root.join("tags");
                predicates
                        .add(criteriaBuilder.equal(criteriaBuilder.lower(tagsJoin.get("name")), tagName.toLowerCase()));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}