package com.hyecheon.socialexample.file;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
    List<FileAttachment> findByCreatedAtBeforeAndHoaxIsNull(LocalDateTime createdAt);

}
