package com.hyecheon.socialexample.file;

import com.hyecheon.socialexample.configuration.AppConfiguration;
import org.apache.commons.io.FileUtils;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FileService {
    private final AppConfiguration appConfiguration;

    private final Tika tika;

    public FileService(AppConfiguration appConfiguration) {
        this.appConfiguration = appConfiguration;
        tika = new Tika();
    }

    public String saveProfileImage(String base64Image) throws IOException {
        final byte[] decodedBytes = Base64Utils.decodeFromString(base64Image);
        final String imageName = getRandomName() + getExtension(detectType(decodedBytes));

        final File target = new File(appConfiguration.getFullProfileImagePath() + "/" + imageName);
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
            Files.deleteIfExists(Paths.get(appConfiguration.getFullProfileImagePath() + "/" + image));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public FileAttachment saveAttachment(MultipartFile file) {
        final FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setCreatedAt(LocalDateTime.now());
        fileAttachment.setName(getRandomName());
        return fileAttachment;
    }

    private String getRandomName() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

}
