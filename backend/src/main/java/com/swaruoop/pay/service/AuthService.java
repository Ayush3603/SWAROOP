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
import java.util.stream.Collectors;

/**
 * Authentication Service
 * Handles user registration, login, and session management
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final ProfileRepository profileRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Register a new user
     */
    @Transactional
    public Profile register(String name, String phone) {
        if (profileRepository.existsByPhone(phone)) {
            throw new IllegalStateException("Account already exists for phone: " + phone);
        }

        Profile profile = Profile.builder()
                .name(name.trim())
                .phone(phone.trim())
                .wallet(0L)
                .faceDescriptor(null)
                .createdAt(Instant.now())
                .build();

        profile = profileRepository.save(profile);

        // Auto-link bank accounts
        autoLinkBankAccounts(profile, name.trim());

        return profile;
    }

    /**
     * Login a user
     */
    @Transactional(readOnly = true)
    public Profile login(String phone) {
        return profileRepository.findByPhone(phone)
                .orElseThrow(() -> new IllegalStateException("No account found for phone: " + phone));
    }

    /**
     * Logout - clears session (in production, this would be JWT token invalidation)
     */
    public void logout(String phone) {
        // Session cleanup handled by frontend token removal
    }

    /**
     * Auto-link bank accounts for a new user
     */
    private void autoLinkBankAccounts(Profile profile, String holderName) {
        List<BankAccount> banks = generateLinkedBanks(profile.getPhone(), profile.getId(), holderName);
        bankAccountRepository.saveAll(banks);
    }

    /**
     * Generate demo bank accounts (similar to frontend logic)
     */
    private List<BankAccount> generateLinkedBanks(String phone, Long profileId, String holderName) {
        long seed = parseSeed(phone);
        
        String[] bankNames = {
            "HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", 
            "Kotak Bank", "PNB", "Yes Bank", "Canara Bank"
        };
        
        return List.of(
            BankAccount.builder()
                    .profile(Profile.builder().id(profileId).build())
                    .bankName(bankNames[(int)(seed % bankNames.length)])
                    .holderName(holderName)
                    .last4(String.valueOf(1000 + (int)(Math.abs(seed) % 9000)))
                    .accountType(AccountType.CHECKING)
                    .createdAt(Instant.now())
                    .build(),
            BankAccount.builder()
                    .profile(Profile.builder().id(profileId).build())
                    .bankName(bankNames[(int)((seed * 7 + 3) % bankNames.length)])
                    .holderName(holderName)
                    .last4(String.valueOf(1000 + (int)((seed * 7 + 11) % 9000)))
                    .accountType(AccountType.SAVINGS)
                    .createdAt(Instant.now())
                    .build()
        );
    }

    private long parseSeed(String phone) {
        String digits = phone.replaceAll("\\D", "");
        if (digits.isEmpty()) return 424242;
        try {
            return Long.parseLong(digits.substring(Math.max(0, digits.length() - 6))) % 1000000;
        } catch (NumberFormatException e) {
            return 424242;
        }
    }

    /**
     * Get profile by ID
     */
    @Transactional(readOnly = true)
    public Profile getProfile(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));
    }

    /**
     * Delete account and all related data
     */
    @Transactional
    public void deleteAccount(Long profileId) {
        profileRepository.findById(profileId)
                .ifPresent(profile -> {
                    transactionRepository.deleteByProfileId(profileId);
                    bankAccountRepository.deleteByProfileId(profileId);
                    profileRepository.delete(profile);
                });
    }
}
