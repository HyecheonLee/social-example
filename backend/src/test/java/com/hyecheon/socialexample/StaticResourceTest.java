package com.hyecheon.socialexample;

import com.hyecheon.socialexample.configuration.AppConfiguration;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.io.File;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class StaticResourceTest {
    @Autowired
    private AppConfiguration appConfiguration;

    @Test
    void checkStaticFolder_whenAppIsInitialized_uploadFolderMustExist() {
        final File uploadFolder = new File(appConfiguration.getUploadPath());
        final boolean uploadFolderExist = uploadFolder.exists() && uploadFolder.isDirectory();
        assertThat(uploadFolderExist).isTrue();
    }

    @Test
    void checkStaticFolder_whenAppIsInitialized_profileImageSubFolderMustExist() {
        final String profileImageFolderPath = appConfiguration.getFullProfileImagePath();

        final File profileImageFolder = new File(profileImageFolderPath);
        final boolean profileImageFolderExists = profileImageFolder.exists() && profileImageFolder.isDirectory();
        assertThat(profileImageFolderExists).isTrue();
    }

    @Test
    void checkStaticFolder_whenAppIsInitialized_attachmentsSubFolderMustExist() {
        final String attachmentsFolderPath = appConfiguration.getAttachmentsFolderPath();
        final File attachmentFolder = new File(attachmentsFolderPath);
        final boolean attachmentFolderFolderExists = attachmentFolder.exists() && attachmentFolder.isDirectory();
        assertThat(attachmentFolderFolderExists).isTrue();
    }
}
