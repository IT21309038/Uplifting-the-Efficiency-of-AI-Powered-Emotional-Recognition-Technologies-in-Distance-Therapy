package com.rp.thera.up.customException;

import org.springframework.http.HttpStatus;

public class StorageException extends RuntimeException {

    private final HttpStatus status;

    public StorageException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
