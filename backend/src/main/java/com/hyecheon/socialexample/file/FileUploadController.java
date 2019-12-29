package com.hyecheon.socialexample.file;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/1.0/hoaxes")
public class FileUploadController {

    private final FileService fileService;

    @PostMapping("/upload")
    public FileAttachment uploadFileAttachment(MultipartFile file) {
        final FileAttachment fileAttachment = fileService.saveAttachment(file);
        return fileAttachment;
    }
}
