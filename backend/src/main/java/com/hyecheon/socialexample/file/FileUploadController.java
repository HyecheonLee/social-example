package com.hyecheon.socialexample.file;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/1.0/hoaxes")
public class FileUploadController {

    @PostMapping("/upload")
    public void uploadFileAttachment() {

    }
}
