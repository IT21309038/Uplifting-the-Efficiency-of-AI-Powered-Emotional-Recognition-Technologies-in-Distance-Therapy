package com.rp.thera.up.exception;

import com.rp.thera.up.ResponseHandler;
import com.rp.thera.up.customException.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;

@ControllerAdvice
public class GlobalExceptionHandler {

    //Handle generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(Exception e, WebRequest request){
        return ResponseHandler.responseBuilder("An error occurred in the system", HttpStatus.INTERNAL_SERVER_ERROR, null);
    }

    //Handle custom exceptions
    @ExceptionHandler(GlobalGetException.class)
    public ResponseEntity<Object> handleGlobalGetException(GlobalGetException e, WebRequest request){
        return ResponseHandler.responseBuilder(e.getMessage(), HttpStatus.NOT_FOUND, new ArrayList<>());
    }

    @ExceptionHandler(DoctorException.class)
    public ResponseEntity<Object> handleDoctorException(DoctorException e, WebRequest request){
        return ResponseHandler.responseBuilder(e.getMessage(), e.getStatus(), null);
    }

    @ExceptionHandler(PatientException.class)
    public ResponseEntity<Object> handlePatientException(PatientException e, WebRequest request){
        return ResponseHandler.responseBuilder(e.getMessage(), e.getStatus(), null);
    }

    @ExceptionHandler(PostTherapyException.class)
    public ResponseEntity<Object> handlePostTherapyException(PostTherapyException e, WebRequest request){
        return ResponseHandler.responseBuilder(e.getMessage(), e.getStatus(), null);
    }

    @ExceptionHandler(StorageException.class)
    public ResponseEntity<Object> handleStorageException(StorageException e, WebRequest request){
        return ResponseHandler.responseBuilder(e.getMessage(), e.getStatus(), null);
    }
}
