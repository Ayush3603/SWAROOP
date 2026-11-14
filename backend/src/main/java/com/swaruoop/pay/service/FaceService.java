package com.swaruoop.pay.service;

import com.swaruoop.pay.model.Profile;
import com.swaruoop.pay.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Face Recognition Service
 * Handles face enrollment and matching
 */
@Service
@RequiredArgsConstructor
public class FaceService {

    private final ProfileRepository profileRepository;

    @Value("${app.face.matching-threshold:0.55}")
    private double matchingThreshold;

    /**
     * Enroll/link face for a profile
     */
    public Profile enrollFace(Long profileId, String faceDescriptorJson) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalStateException("Profile not found"));

        profile.setFaceDescriptor(faceDescriptorJson);
        return profileRepository.save(profile);
    }

    /**
     * Identify face against enrolled profiles
     * @param faceDescriptorJson JSON array of 128 doubles
     * @return Matched profile or null if no match
     */
    public MatchResult identifyFace(String faceDescriptorJson) {
        List<Profile> enrolledProfiles = profileRepository.findAll().stream()
                .filter(p -> p.hasLinkedFace())
                .collect(Collectors.toList());

        if (enrolledProfiles.isEmpty()) {
            return new MatchResult(null, Double.MAX_VALUE);
        }

        // Parse the incoming descriptor
        double[] incoming = parseDescriptor(faceDescriptorJson);
        if (incoming == null || incoming.length != 128) {
            throw new IllegalArgumentException("Invalid face descriptor - must be 128-dimensional");
        }

        // Find best match
        Profile bestMatch = null;
        double bestDistance = Double.MAX_VALUE;

        for (Profile profile : enrolledProfiles) {
            double[] enrolled = parseDescriptor(profile.getFaceDescriptor());
            double distance = euclideanDistance(incoming, enrolled);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = profile;
            }
        }

        // Check if match is within threshold
        if (bestMatch != null && bestDistance <= matchingThreshold) {
            return new MatchResult(bestMatch, bestDistance);
        }

        return new MatchResult(null, bestDistance);
    }

    /**
     * Parse JSON descriptor string to double array
     */
    private double[] parseDescriptor(String descriptor) {
        if (descriptor == null || descriptor.isEmpty()) {
            return null;
        }

        try {
            // Simple JSON array parsing - format: [1.23,4.56,...]
            String trimmed = descriptor.trim();
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                trimmed = trimmed.substring(1, trimmed.length() - 1);
            }

            String[] values = trimmed.split(",");
            double[] result = new double[values.length];

            for (int i = 0; i < values.length; i++) {
                result[i] = Double.parseDouble(values[i].trim());
            }

            return result;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Calculate Euclidean distance between two descriptors
     */
    private double euclideanDistance(double[] a, double[] b) {
        double sum = 0.0;
        for (int i = 0; i < a.length; i++) {
            double diff = a[i] - b[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    /**
     * Match result container
     */
    public static class MatchResult {
        private final Profile profile;
        private final double distance;

        public MatchResult(Profile profile, double distance) {
            this.profile = profile;
            this.distance = distance;
        }

        public Profile getProfile() {
            return profile;
        }

        public double getDistance() {
            return distance;
        }

        public boolean isMatch() {
            return profile != null;
        }
    }
}
