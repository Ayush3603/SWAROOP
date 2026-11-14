package com.swaruoop.pay.controller;

import com.swaruoop.pay.model.Profile;
import com.swaruoop.pay.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.net.URI;

/**
 * Authentication Controller
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Profile> signup(
            @RequestParam @NotBlank String name,
            @RequestParam @NotBlank String phone) {
        
        Profile profile = authService.register(name, phone);
        return ResponseEntity.created(URI.create("/api/auth/" + profile.getId()))
                .body(profile);
    }

    @PostMapping("/login")
    public ResponseEntity<Profile> login(@RequestParam @NotBlank String phone) {
        Profile profile = authService.login(phone);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable Long id) {
        Profile profile = authService.getProfile(id);
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        authService.deleteAccount(id);
        return ResponseEntity.ok().build();
    }
}
