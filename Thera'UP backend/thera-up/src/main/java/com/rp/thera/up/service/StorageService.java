package com.rp.thera.up.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String uploadResource(String folderPath, String fileName, MultipartFile file);

    void deleteResource(String folderPath, String fileName);
}
