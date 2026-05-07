package com.sch.homebase.dto;

public class GeocodeResult {

    private double lat;
    private double lng;
    private String address;

    public GeocodeResult(double lat, double lng, String address) {
        this.lat = lat;
        this.lng = lng;
        this.address = address;
    }

    public double getLat() {
        return lat;
    }

    public double getLng() {
        return lng;
    }

    public String getAddress() {
        return address;
    }
}