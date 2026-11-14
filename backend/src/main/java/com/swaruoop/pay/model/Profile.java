package com.swaruoop.pay.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Profile Entity - Represents a user account in Swaruoop Pay
 * 
 * All money values are stored as long (cents) to avoid floating-point bugs.
 */
@Entity
@Table(name = "profiles", uniqueConstraints = {
    @UniqueConstraint(columnNames = "phone")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    // Wallet balance in cents
    @Column(nullable = false)
    private Long wallet = 0L;

    // Face descriptor - 128-d embedding stored as JSON array
    @Lob
    @Column(columnDefinition = "TEXT")
    private String faceDescriptor;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    // One-to-many relationship with BankAccount
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<BankAccount> bankAccounts = new ArrayList<>();

    // One-to-many relationship with Transaction
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Transaction> transactions = new ArrayList<>();

    /**
     * Check if face is enrolled
     */
    public boolean hasLinkedFace() {
        return faceDescriptor != null && !faceDescriptor.isEmpty();
    }
}
