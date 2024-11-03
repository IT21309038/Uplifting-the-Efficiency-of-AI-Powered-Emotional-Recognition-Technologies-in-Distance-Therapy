package com.rp.thera.up.customException;

import org.springframework.http.HttpStatus;

public class DoctorException extends RuntimeException{

    private final HttpStatus status;

    public DoctorException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
