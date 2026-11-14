package com.swaruoop.pay.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

/**
 * BankAccount Entity - Represents a linked bank account
 */
@Entity
@Table(name = "bank_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    @ToString.Exclude
    private Profile profile;

    @Column(nullable = false, length = 100)
    private String bankName;

    @Column(nullable = false, length = 100)
    private String holderName;

    // Only last 4 digits stored for security
    @Column(nullable = false, length = 4)
    private String last4;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    /**
     * Get full account display (bank + last 4)
     */
    public String getDisplayAccount() {
        return "••" + last4;
    }
}
