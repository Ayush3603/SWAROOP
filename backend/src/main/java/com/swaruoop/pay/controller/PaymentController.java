package com.swaruoop.pay.controller;

import com.swaruoop.pay.model.Transaction;
import com.swaruoop.pay.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

/**
 * Payment Controller
 */
@RestController
@RequestMapping("/api/pay")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/charge")
    public ResponseEntity<PaymentResponse> charge(
            @RequestBody ChargeRequest request) {
        
        PaymentService.PaymentResult result = paymentService.chargeProfile(
                request.getProfileId(),
                request.getAmountCents()
        );

        PaymentResponse response = new PaymentResponse();
        response.setSuccess(result.isSuccess());
        
        if (result.isSuccess()) {
            response.setTransaction(result.getTransaction());
        } else {
            response.setError(result.getError());
        }
        
        return ResponseEntity.ok(response);
    }

    public static class ChargeRequest {
        @NotNull
        private Long profileId;
        @NotNull
        private Long amountCents;

        // Getters and setters
        public Long getProfileId() { return profileId; }
        public void setProfileId(Long profileId) { this.profileId = profileId; }
        
        public Long getAmountCents() { return amountCents; }
        public void setAmountCents(Long amountCents) { this.amountCents = amountCents; }
    }

    public static class PaymentResponse {
        private Boolean success;
        private String error;
        private Transaction transaction;

        // Getters and setters
        public Boolean getSuccess() { return success; }
        public void setSuccess(Boolean success) { this.success = success; }
        
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        
        public Transaction getTransaction() { return transaction; }
        public void setTransaction(Transaction transaction) { this.transaction = transaction; }
    }
}
