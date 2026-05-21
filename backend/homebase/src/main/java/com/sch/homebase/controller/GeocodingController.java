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

    // Limit calls to 1/1.5s since Nominatim limits free calls
    // In the future, this should be changed to a different API that enables more calls
    private static final long REQUEST_COOLDOWN_MS = 1500;

    private final GeocodingService geocodingService;

    // Tracks the last time the backend allowed a geocoding request
    private long lastRequestTime = 0;

    public GeocodingController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    // GET /api/geocode/search - seaches address given the String query, returns data like lat and lng
    @GetMapping("/search")
    public ResponseEntity<?> searchAddress(@RequestParam String query) {
        if (!canMakeRequest()) {
            System.err.println("DEBUG: ERR FROM /search: too many requests");
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many requests. Please wait before trying again.");
        }

        GeocodeResult result = geocodingService.searchAddress(query);
        return ResponseEntity.ok(result);
    }

    // GET /api/geocode/search - given lat and lng, reverse geocode to find address
    @GetMapping("/reverse")
    public ResponseEntity<?> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        if (!canMakeRequest()) {
            System.err.println("DEBUG: ERR FROM /reverse: too many requests");
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many requests. Please wait before trying again.");
        }

        GeocodeResult result = geocodingService.reverseGeocode(lat, lng);
        return ResponseEntity.ok(result);
    }

    // limit calls in this controller to every 1 ever REQUEST_COOLDOWN_MS ms
    private synchronized boolean canMakeRequest() {
        long currentTime = System.currentTimeMillis();

        if (currentTime - lastRequestTime < REQUEST_COOLDOWN_MS) {
            return false;
        }

        lastRequestTime = currentTime;
        return true;
    }
}