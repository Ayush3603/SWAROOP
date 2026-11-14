package com.swaruoop.pay.controller;

import com.swaruoop.pay.model.Profile;
import com.swaruoop.pay.service.FaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

/**
 * Face Recognition Controller
 */
@RestController
@RequestMapping("/api/face")
@RequiredArgsConstructor
public class FaceController {

    private final FaceService faceService;

    @PostMapping("/enroll/{profileId}")
    public ResponseEntity<Profile> enrollFace(
            @PathVariable Long profileId,
            @RequestBody Map<String, String> request) {
        
        String descriptor = request.get("descriptor");
        if (descriptor == null || descriptor.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Profile profile = faceService.enrollFace(profileId, descriptor);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/identify")
    public ResponseEntity<FaceMatchResponse> identifyFace(
            @RequestBody Map<String, String> request) {
        
        String descriptor = request.get("descriptor");
        if (descriptor == null || descriptor.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        FaceService.MatchResult result = faceService.identifyFace(descriptor);
        
        FaceMatchResponse response = new FaceMatchResponse();
        response.setProfileId(result.getProfile() != null ? result.getProfile().getId() : null);
        response.setProfileName(result.getProfile() != null ? result.getProfile().getName() : null);
        response.setDistance(result.getDistance());
        response.setMatched(result.isMatch());
        
        return ResponseEntity.ok(response);
    }

    public static class FaceMatchResponse {
        private Long profileId;
        private String profileName;
        private Double distance;
        private Boolean matched;

        // Getters and setters
        public Long getProfileId() { return profileId; }
        public void setProfileId(Long profileId) { this.profileId = profileId; }
        
        public String getProfileName() { return profileName; }
        public void setProfileName(String profileName) { this.profileName = profileName; }
        
        public Double getDistance() { return distance; }
        public void setDistance(Double distance) { this.distance = distance; }
        
        public Boolean getMatched() { return matched; }
        public void setMatched(Boolean matched) { this.matched = matched; }
    }
}
