package com.rp.thera.up;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class ResponseHandler {

    public static ResponseEntity<Object> responseBuilder(String message, HttpStatus status, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("statusCode", status.value());
        response.put("data", data);
        return new ResponseEntity<>(response, status);
    }

    public static ResponseEntity<Object> responseGetBuilder(String message, HttpStatus status, Object dataObj, int totalRecords) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("statusCode", status.value());

        Map<String, Object> data = new HashMap<>();
        data.put("data", dataObj);
        data.put("totalCount", totalRecords);

        response.put("data", data);
        return new ResponseEntity<>(response, status);
    }
}
