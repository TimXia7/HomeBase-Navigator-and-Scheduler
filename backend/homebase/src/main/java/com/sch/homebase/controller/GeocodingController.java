package com.sch.homebase.controller;

import com.sch.homebase.dto.GeocodeResult;
import com.sch.homebase.service.GeocodingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/geocode")
public class GeocodingController {

    private final GeocodingService geocodingService;

    public GeocodingController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @GetMapping("/search")
    public ResponseEntity<GeocodeResult> searchAddress(@RequestParam String query) {
        GeocodeResult result = geocodingService.searchAddress(query);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reverse")
    public ResponseEntity<GeocodeResult> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        GeocodeResult result = geocodingService.reverseGeocode(lat, lng);
        return ResponseEntity.ok(result);
    }
}