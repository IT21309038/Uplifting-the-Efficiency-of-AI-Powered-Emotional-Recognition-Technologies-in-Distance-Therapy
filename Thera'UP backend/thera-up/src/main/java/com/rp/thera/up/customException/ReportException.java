package com.rp.thera.up.customException;

import org.springframework.http.HttpStatus;

public class ReportException extends RuntimeException {

    private final HttpStatus status;

    public ReportException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
