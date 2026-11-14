package com.swaruoop.pay.controller;

import com.swaruoop.pay.model.AccountType;
import com.swaruoop.pay.model.BankAccount;
import com.swaruoop.pay.model.Transaction;
import com.swaruoop.pay.service.BankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Banking Controller
 */
@RestController
@RequestMapping("/api/banking")
@RequiredArgsConstructor
public class BankingController {

    private final BankingService bankingService;

    @GetMapping("/{profileId}/accounts")
    public ResponseEntity<List<BankAccount>> getBankAccounts(@PathVariable Long profileId) {
        List<BankAccount> accounts = bankingService.getBankAccounts(profileId);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/{profileId}/accounts")
    public ResponseEntity<BankAccount> addBankAccount(
            @PathVariable Long profileId,
            @RequestBody AddBankRequest request) {
        
        BankAccount account = bankingService.addBankAccount(
                profileId,
                request.getBankName(),
                request.getHolderName(),
                request.getAccountNumber(),
                request.getAccountType()
        );
        return ResponseEntity.ok(account);
    }

    @DeleteMapping("/accounts/{bankId}")
    public ResponseEntity<Void> removeBankAccount(
            @PathVariable Long bankId,
            @RequestParam Long profileId) {
        
        bankingService.removeBankAccount(bankId, profileId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{profileId}/add-funds")
    public ResponseEntity<Transaction> addFunds(
            @PathVariable Long profileId,
            @RequestParam Long bankId,
            @RequestParam @NotNull Long amountCents) {
        
        Transaction transaction = bankingService.addFunds(profileId, bankId, amountCents);
        return ResponseEntity.ok(transaction);
    }

    public static class AddBankRequest {
        @NotBlank
        private String bankName;
        @NotBlank
        private String holderName;
        @NotBlank
        private String accountNumber;
        @NotNull
        private AccountType accountType;

        // Getters and setters
        public String getBankName() { return bankName; }
        public void setBankName(String bankName) { this.bankName = bankName; }
        
        public String getHolderName() { return holderName; }
        public void setHolderName(String holderName) { this.holderName = holderName; }
        
        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        
        public AccountType getAccountType() { return accountType; }
        public void setAccountType(AccountType accountType) { this.accountType = accountType; }
    }
}
