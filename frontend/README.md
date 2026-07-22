Onboarding Brief Notes

Spring Boot Backend Overview
- Backend runs on port 8081.

Main purpose right now:
- Hide Nominatim/OpenStreetMap geocoding calls behind a backend API.
- Add rate limiting/cooldown.
- Return a simplified DTO to the frontend.

Backend controls request formatting, headers, rate limiting, and future provider changes.

GeocodingController

Base route:
/api/geocode

Endpoints:
GET /api/geocode/search?query=...
GET /api/geocode/reverse?lat=...&lng=...

Uses GeocodingService for actual external API calls.
- Adds cooldown rate limiting:
- One request every 1500 ms.
- Returns 429 TOO_MANY_REQUESTS if called too quickly.
- Uses @CrossOrigin for localhost:3000 frontend.
- Controller handles HTTP request/response logic, while service handles external API communication.

Production improvement:
- Replace global cooldown with per-user or per-IP rate limiting.

GeocodingService
- Service class that calls Nominatim/OpenStreetMap API.
- Uses Spring RestClient.
- Sets base URL: https://nominatim.openstreetmap.org
