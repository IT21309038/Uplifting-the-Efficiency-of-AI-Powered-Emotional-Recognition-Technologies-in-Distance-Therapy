package com.rp.thera.up.DTO.Schedule;

import java.util.UUID;

public class SessionCodeGenerator {
    public static String generateSessionCode() {
        return "THRPY-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
