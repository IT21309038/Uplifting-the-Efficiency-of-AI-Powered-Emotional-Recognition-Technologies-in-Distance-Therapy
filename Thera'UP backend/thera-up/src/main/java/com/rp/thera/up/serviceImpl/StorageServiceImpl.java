package com.rp.thera.up.serviceImpl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.rp.thera.up.customException.StorageException;
import com.rp.thera.up.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;

@Service
public class StorageServiceImpl implements StorageService {

    @Value("${application.bucket.name}")
    private String bucketName;

    @Autowired
    private AmazonS3 s3Client;


    @Override
    public String uploadResource(String folderPath, String fileName, MultipartFile file) throws StorageException {

        //check all are required
        if (folderPath == null || fileName == null || file == null) {
            throw new StorageException("All fields required", HttpStatus.BAD_REQUEST);
        }

        //file name should be appended with timestamp
        String objectKey = folderPath + "/" + fileName;

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentDisposition("inline; filename=\"" + fileName + "\"");
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            s3Client.putObject(new PutObjectRequest(bucketName, objectKey, file.getInputStream(), metadata));
            s3Client.setObjectAcl(bucketName, objectKey, CannedAccessControlList.PublicRead);
            URL publicUrl = s3Client.getUrl(bucketName, objectKey);

            return publicUrl.toString();
        } catch (Exception e) {
            throw new StorageException("Failed to upload resource", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteResource(String folderPath, String fileName) {

        //check all are required
        if (folderPath == null || fileName == null) {
            throw new StorageException("All fields required", HttpStatus.BAD_REQUEST);
        }

        String objectKey = folderPath + "/" + fileName;

        try {
            s3Client.deleteObject(bucketName, objectKey);
        } catch (Exception e) {
            throw new StorageException("Failed to delete resource", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
