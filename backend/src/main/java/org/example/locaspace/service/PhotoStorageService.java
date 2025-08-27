package org.example.locaspace.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PhotoStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public List<String> storePropertyPhotos(Long lieuId, List<MultipartFile> files) throws IOException {
        Path root = Paths.get(uploadDir, "lieux", String.valueOf(lieuId));
        Files.createDirectories(root);

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String original = file.getOriginalFilename();
            String ext = original != null && original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
            String unique = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                    + "-" + UUID.randomUUID() + ext;
            Path target = root.resolve(unique);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            // Public URL served by WebMvcConfig under /uploads/**
            String publicUrl = "/uploads/lieux/" + lieuId + "/" + unique;
            urls.add(publicUrl);
        }
        return urls;
    }
}





