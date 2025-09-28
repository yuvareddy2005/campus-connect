// File: src/main/java/com/campusconnect/campus_connect/repository/UserRepository.java

package com.campusconnect.campus_connect.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusconnect.campus_connect.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Method to find a user by their email address
    Optional<User> findByEmail(String email);
}