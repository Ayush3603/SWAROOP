package com.swaruoop.pay.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

/**
 * Transaction Entity - Represents payments and top-ups
 */
@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    @ToString.Exclude
    private Profile profile;

    @Column(nullable = false)
    private String profileName;

    // Amount in cents (always positive)
    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TxnType type;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    // Wallet balance after this transaction
    @Column(nullable = false)
    private Long balanceAfter;

    // Source for top-ups (e.g., "HDFC Bank ••1234")
    @Column(length = 200)
    private String source;
}
