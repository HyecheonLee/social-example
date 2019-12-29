package com.hyecheon.socialexample.file;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class FileAttachmentVM {
    private Long id;
    private String name;
    private String fileType;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;


    public FileAttachmentVM(FileAttachment fileAttachment) {
        this.setId(fileAttachment.getId());
        this.setName(fileAttachment.getName());
        this.setFileType(fileAttachment.getFileType());
        this.setCreatedAt(fileAttachment.getCreatedAt());
    }
}