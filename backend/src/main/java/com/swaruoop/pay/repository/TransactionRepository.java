package com.swaruoop.pay.repository;

import com.swaruoop.pay.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Transaction Repository
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByProfileId(Long profileId);
    
    void deleteByProfileId(Long profileId);
}
