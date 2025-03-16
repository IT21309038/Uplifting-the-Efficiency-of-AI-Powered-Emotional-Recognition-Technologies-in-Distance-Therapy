package com.rp.thera.up.controller;

import com.rp.thera.up.DTO.postTherapyDTO.*;
import com.rp.thera.up.ResponseHandler;
import com.rp.thera.up.service.PostTherapyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/theraup/postTherapy")
@CrossOrigin(origins = "*")

public class PostTherapyController {
    @Autowired
    private PostTherapyService postTherapyService;

    @PostMapping(value = "/assignActivities")
    public ResponseEntity<?> createPostTherapy(@RequestBody PostTherapyCreateDTO postTherapyCreateDTO) {
        postTherapyService.createPostTherapy(postTherapyCreateDTO);
        return ResponseHandler.responseBuilder("Activity Assigned successfully", HttpStatus.CREATED, null);
    }
}
