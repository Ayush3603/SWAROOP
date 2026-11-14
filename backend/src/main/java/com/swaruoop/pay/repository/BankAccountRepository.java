package com.swaruoop.pay.repository;

import com.swaruoop.pay.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * BankAccount Repository
 */
@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    
    List<BankAccount> findByProfileId(Long profileId);
    
    void deleteByProfileId(Long profileId);
}
