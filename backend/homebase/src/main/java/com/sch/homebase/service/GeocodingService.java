package com.sch.homebase.service;

import com.sch.homebase.dto.GeocodeResult;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GeocodingService {

    private final RestClient restClient;

    public GeocodingService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader("User-Agent", "HomeBase/1.0")
                .build();
    }

    public GeocodeResult searchAddress(String query) {
        String trimmedQuery = query.trim();

        if (trimmedQuery.isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty.");
        }

        List<Map<String, Object>> response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("format", "json")
                        .queryParam("q", trimmedQuery)
                        .queryParam("limit", 1)
                        .build())
                .retrieve()
                .body(List.class);

        if (response == null || response.isEmpty()) {
            throw new RuntimeException("Address not found.");
        }

        Map<String, Object> firstResult = response.get(0);

        double lat = Double.parseDouble((String) firstResult.get("lat"));
        double lng = Double.parseDouble((String) firstResult.get("lon"));
        String address = (String) firstResult.get("display_name");

        return new GeocodeResult(lat, lng, address);
    }

    public GeocodeResult reverseGeocode(double lat, double lng) {
        Map<String, Object> response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/reverse")
                        .queryParam("format", "json")
                        .queryParam("lat", lat)
                        .queryParam("lon", lng)
                        .build())
                .retrieve()
                .body(Map.class);

        if (response == null || response.isEmpty()) {
            throw new RuntimeException("Address not found.");
        }

        String address = (String) response.get("display_name");

        if (address == null || address.isBlank()) {
            address = "Address not found";
        }

        return new GeocodeResult(lat, lng, address);
    }
}