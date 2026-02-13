package com.cafedesk.backend.admin.DTO;

public class AdminLoginResponse {

    private String message;
    private String token;

    public AdminLoginResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }
}
