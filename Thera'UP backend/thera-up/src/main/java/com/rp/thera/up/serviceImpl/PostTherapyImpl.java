package com.rp.thera.up.serviceImpl;

import com.rp.thera.up.DTO.postTherapyDTO.PostTherapyCreateDTO;
import com.rp.thera.up.customException.PostTherapyException;
import com.rp.thera.up.entity.PostTherapy;
import com.rp.thera.up.repo.PostTherapyRepo;
import com.rp.thera.up.service.PostTherapyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class PostTherapyImpl implements PostTherapyService {
    @Autowired
    private PostTherapyRepo postTherapyRepo;

    @Override
    public void createPostTherapy(PostTherapyCreateDTO postTherapyCreateDTO) throws PostTherapyException {
        String patient_id = postTherapyCreateDTO.getPatient_id();
        String activity_id = postTherapyCreateDTO.getActivity_id();
        String allocated_duration = postTherapyCreateDTO.getAllocated_duration();
        String remaining_time = postTherapyCreateDTO.getRemaining_time();

        //Throw the exceptions as needed
        if (allocated_duration.isEmpty()) {
        throw new PostTherapyException("Allocated Duration Is Required", HttpStatus.BAD_REQUEST);
        }

        PostTherapy postTherapy = new PostTherapy();
        postTherapy.setPatient_id(patient_id);
        postTherapy.setActivity_id(activity_id);
        postTherapy.setAllocated_duration(allocated_duration);
        postTherapy.setRemaining_time(remaining_time);

        postTherapyRepo.save(postTherapy);
    }
}
