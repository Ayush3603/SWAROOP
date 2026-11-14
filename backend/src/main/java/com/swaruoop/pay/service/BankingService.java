package com.swaruoop.pay.service;

import com.swaruoop.pay.model.AccountType;
import com.swaruoop.pay.model.BankAccount;
import com.swaruoop.pay.model.Profile;
import com.swaruoop.pay.model.TxnType;
import com.swaruoop.pay.repository.BankAccountRepository;
import com.swaruoop.pay.repository.ProfileRepository;
import com.swaruoop.pay.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Banking Service
 * Handles bank account management and wallet funding
 */
@Service
@RequiredArgsConstructor
public class BankingService {

    private final ProfileRepository profileRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Add a bank account to a profile
     */
    @Transactional
    public BankAccount addBankAccount(Long profileId, String bankName, String holderName, 
                                      String accountNumber, AccountType accountType) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        String last4 = accountNumber.replaceAll("\\D", "");
        if (last4.length() < 4) {
            last4 = last4 + "0000".substring(0, 4 - last4.length());
        }

        BankAccount bank = BankAccount.builder()
                .profile(profile)
                .bankName(bankName.trim())
                .holderName(holderName.trim())
                .last4(last4.substring(Math.max(0, last4.length() - 4)))
                .accountType(accountType)
                .createdAt(Instant.now())
                .build();

        return bankAccountRepository.save(bank);
    }

    /**
     * Remove a bank account
     */
    @Transactional
    public void removeBankAccount(Long bankId, Long profileId) {
        BankAccount bank = bankAccountRepository.findById(bankId)
                .orElseThrow(() -> new IllegalStateException("Bank account not found"));

        if (!bank.getProfile().getId().equals(profileId)) {
            throw new IllegalStateException("Bank account does not belong to this profile");
        }

        bankAccountRepository.delete(bank);
    }

    /**
     * Add funds to wallet from a bank account
     */
    @Transactional
    public Transaction addFunds(Long profileId, Long bankId, Long amountCents) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        BankAccount bank = bankAccountRepository.findById(bankId)
                .orElseThrow(() -> new IllegalStateException("Bank account not found"));

        if (!bank.getProfile().getId().equals(profileId)) {
            throw new IllegalStateException("Bank account does not belong to this profile");
        }

        if (amountCents <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        // Update wallet balance
        profile.setWallet(profile.getWallet() + amountCents);
        profileRepository.save(profile);

        // Create transaction
        Transaction transaction = Transaction.builder()
                .profile(profile)
                .profileName(profile.getName())
                .amount(amountCents)
                .type(TxnType.TOPUP)
                .createdAt(Instant.now())
                .balanceAfter(profile.getWallet())
                .source(bank.getBankName() + " ••" + bank.getLast4())
                .build();

        transactionRepository.save(transaction);

        return transaction;
    }

    /**
     * Get all bank accounts for a profile
     */
    @Transactional(readOnly = true)
    public List<BankAccount> getBankAccounts(Long profileId) {
        return bankAccountRepository.findByProfileId(profileId);
    }

    /**
     * Get bank account by ID
     */
    @Transactional(readOnly = true)
    public BankAccount getBankAccount(Long bankId) {
        return bankAccountRepository.findById(bankId)
                .orElseThrow(() -> new IllegalStateException("Bank account not found"));
    }
}
