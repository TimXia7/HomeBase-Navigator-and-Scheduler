package com.sch.homebase.controller;

import com.sch.homebase.dto.GeocodeResult;
import com.sch.homebase.service.GeocodingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/geocode")
@CrossOrigin(origins = "http://localhost:3000")
public class GeocodingController {

    private static final long REQUEST_COOLDOWN_MS = 1500;

    private final GeocodingService geocodingService;

    // Tracks the last time the backend allowed a geocoding request
    private long lastRequestTime = 0;

    public GeocodingController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchAddress(@RequestParam String query) {
        if (!canMakeRequest()) {
            System.err.println("ERR FROM /search: too many requests");
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many requests. Please wait before trying again.");
        }

        GeocodeResult result = geocodingService.searchAddress(query);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reverse")
    public ResponseEntity<?> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        if (!canMakeRequest()) {
            System.err.println("ERR FROM /reverse: too many requests");
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many requests. Please wait before trying again.");
        }

        GeocodeResult result = geocodingService.reverseGeocode(lat, lng);
        return ResponseEntity.ok(result);
    }

    private synchronized boolean canMakeRequest() {
        long currentTime = System.currentTimeMillis();

        if (currentTime - lastRequestTime < REQUEST_COOLDOWN_MS) {
            return false;
        }

        lastRequestTime = currentTime;
        return true;
    }
}