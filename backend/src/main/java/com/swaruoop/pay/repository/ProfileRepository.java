package com.swaruoop.pay.repository;

import com.swaruoop.pay.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Profile Repository
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
    Optional<Profile> findByPhone(String phone);
    
    boolean existsByPhone(String phone);
}
