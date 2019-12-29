package com.hyecheon.socialexample.file;

import com.hyecheon.socialexample.configuration.AppConfiguration;
import org.apache.commons.io.FileUtils;
import org.apache.tika.Tika;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@EnableScheduling
@Service
public class FileService {
    private final AppConfiguration appConfiguration;
    private final FileAttachmentRepository fileAttachmentRepository;
    private final Tika tika;

    public FileService(AppConfiguration appConfiguration, FileAttachmentRepository fileAttachmentRepository) {
        this.appConfiguration = appConfiguration;
        this.fileAttachmentRepository = fileAttachmentRepository;
        tika = new Tika();
    }

    public String saveProfileImage(String base64Image) throws IOException {
        final byte[] decodedBytes = Base64Utils.decodeFromString(base64Image);
        final String imageName = getRandomName() + getExtension(detectType(decodedBytes));

        final File target = new File(appConfiguration.getFullProfileImagesPath() + "/" + imageName);
        FileUtils.writeByteArrayToFile(target, decodedBytes);
        return imageName;
    }

    public String detectType(byte[] fileArr) {
        return tika.detect(fileArr);
    }

    public String getExtension(String mineType) {
        switch (mineType) {
            case "image/jpeg":
                return ".jpeg";
            case "image/png":
                return ".png";
            default:
                return "";
        }
    }


    public void deleteProfileImage(String image) {
        try {
            Files.deleteIfExists(Paths.get(appConfiguration.getFullProfileImagesPath() + "/" + image));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public FileAttachment saveAttachment(MultipartFile file) {
        try {
            final String fileType = detectType(file.getBytes());
            final String saveFileName = getRandomName() + getExtension(fileType);
            final String filePath = appConfiguration.getFullAttachmentsPath() + "/" + saveFileName;
            FileCopyUtils.copy(file.getBytes(), new File(filePath));
            final FileAttachment fileAttachment = new FileAttachment();
            fileAttachment.setName(saveFileName);
            fileAttachment.setFileType(fileType);
            fileAttachmentRepository.save(fileAttachment);
            return fileAttachment;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void cleanupStorage() {
        final LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        final List<FileAttachment> oldFiles = fileAttachmentRepository.findByCreatedAtBeforeAndHoaxIsNull(oneHourAgo);
        oldFiles.forEach(fileAttachment -> {
            deleteAttachmentImage(fileAttachment.getName());
            fileAttachmentRepository.deleteById(fileAttachment.getId());
        });
    }

    public void deleteAttachmentImage(String image) {
        try {
            Files.deleteIfExists(Paths.get(appConfiguration.getFullAttachmentsPath() + "/" + image));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String getRandomName() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }


}
