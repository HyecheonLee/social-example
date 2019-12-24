package com.hyecheon.socialexample.file;

import com.hyecheon.socialexample.configuration.AppConfiguration;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FileUtils;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import java.io.File;
import java.io.IOException;
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
        final String imageName = UUID.randomUUID().toString().replaceAll("-", "");

        final byte[] decodedBytes = Base64Utils.decodeFromString(base64Image);
        final File target = new File(appConfiguration.getFullProfileImagePath() + "/" + imageName);
        FileUtils.writeByteArrayToFile(target, decodedBytes);
        return imageName;
    }

    public String detectType(byte[] fileArr) {
        return tika.detect(fileArr);
    }
}
