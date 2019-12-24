package com.hyecheon.socialexample.file;

import com.hyecheon.socialexample.configuration.AppConfiguration;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ActiveProfiles;

import java.io.File;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
class FileServiceTest {

    FileService fileService;

    AppConfiguration appConfiguration;

    @BeforeEach
    void setUp() {
        appConfiguration = new AppConfiguration();
        appConfiguration.setUploadPath("upload-test");

        fileService = new FileService(appConfiguration);

        new File(appConfiguration.getUploadPath()).mkdir();
        new File(appConfiguration.getFullProfileImagePath()).mkdir();
        new File(appConfiguration.getFullAttachmentsPath()).mkdir();
    }

    @Test
    void detectType_whenPngFIleProvided_returnsImagePng() throws IOException {
        final ClassPathResource resourceFile = new ClassPathResource("test-txt.txt");
        final byte[] fileArr = FileUtils.readFileToByteArray(resourceFile.getFile());
        final String fileType = fileService.detectType(fileArr);
        assertThat(fileType).isEqualToIgnoringCase("image/png");
    }

    @AfterEach
    void tearDown() throws IOException {
        FileUtils.cleanDirectory(new File(appConfiguration.getFullProfileImagePath()));
        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
    }
}