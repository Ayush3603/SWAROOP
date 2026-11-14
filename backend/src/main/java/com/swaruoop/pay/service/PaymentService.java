package com.swaruoop.pay.service;

import com.swaruoop.pay.model.Profile;
import com.swaruoop.pay.model.TxnType;
import com.swaruoop.pay.model.Transaction;
import com.swaruoop.pay.repository.ProfileRepository;
import com.swaruoop.pay.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Payment Service
 * Handles face-based payments
 */
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileRepository profileRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Process a payment using face recognition
     */
    @Transactional
    public PaymentResult chargeProfile(Long profileId, Long amountCents) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        if (amountCents <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        if (amountCents > profile.getWallet()) {
            return new PaymentResult(false, "Insufficient wallet balance");
        }

        // Update wallet balance
        long newBalance = profile.getWallet() - amountCents;
        profile.setWallet(newBalance);
        profileRepository.save(profile);

        // Create transaction
        Transaction transaction = Transaction.builder()
                .profile(profile)
                .profileName(profile.getName())
                .amount(amountCents)
                .type(TxnType.PAYMENT)
                .createdAt(Instant.now())
                .balanceAfter(newBalance)
                .build();

        transactionRepository.save(transaction);

        return new PaymentResult(true, transaction);
    }

    /**
     * Payment result container
     */
    public static class PaymentResult {
        private final boolean success;
        private final String error;
        private final Transaction transaction;

        public PaymentResult(boolean success, Transaction transaction) {
            this.success = success;
            this.error = null;
            this.transaction = transaction;
        }

        public PaymentResult(boolean success, String error) {
            this.success = success;
            this.error = error;
            this.transaction = null;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getError() {
            return error;
        }

        public Transaction getTransaction() {
            return transaction;
        }
    }
}
