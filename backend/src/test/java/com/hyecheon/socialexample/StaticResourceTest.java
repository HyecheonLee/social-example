package com.hyecheon.socialexample;

import com.hyecheon.socialexample.configuration.AppConfiguration;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.File;
import java.io.IOException;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class StaticResourceTest {
    @Autowired
    private AppConfiguration appConfiguration;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void checkStaticFolder_whenAppIsInitialized_uploadFolderMustExist() {
        final File uploadFolder = new File(appConfiguration.getUploadPath());
        final boolean uploadFolderExist = uploadFolder.exists() && uploadFolder.isDirectory();
        assertThat(uploadFolderExist).isTrue();
    }

    @Test
    void checkStaticFolder_whenAppIsInitialized_profileImageSubFolderMustExist() {
        final String profileImageFolderPath = appConfiguration.getFullProfileImagesPath();

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

    @Test
    void getStaticFile_whenImageExistInProfileUploadFolder_receiveOk() throws Exception {
        String fileName = "profile-picture.png";
        final File source = new ClassPathResource("profile.png").getFile();

        final File target = new File(appConfiguration.getFullProfileImagesPath() + "/" + fileName);
        FileUtils.copyFile(source, target);

        mockMvc.perform(get("/images/" + appConfiguration.getProfileImageFolder() + "/" + fileName)).andExpect(status().isOk());

    }

    @Test
    void getStaticFile_whenImageExistInAttachmentFolder_receiveOk() throws Exception {
        String fileName = "profile-picture.png";
        final File source = new ClassPathResource("profile.png").getFile();

        final File target = new File(appConfiguration.getFullAttachmentsPath() + "/" + fileName);
        FileUtils.copyFile(source, target);

        mockMvc.perform(get("/images/" + appConfiguration.getAttachmentsFolderPath() + "/" + fileName)).andExpect(status().isOk());

    }

    @Test
    void getStaticFile_whenImageDoesNotExist_receiveNotFound() throws Exception {
        mockMvc.perform(get("/images/" + appConfiguration.getAttachmentsFolderPath() + "/there-is-no-such-image.png"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getStaticFile_whenImageExistInAttachmentFolder_receiveOkWithCacheHeaders() throws Exception {
        String fileName = "profile-picture.png";
        final File source = new ClassPathResource("profile.png").getFile();

        final File target = new File(appConfiguration.getFullAttachmentsPath() + "/" + fileName);
        FileUtils.copyFile(source, target);

        final MvcResult result = mockMvc.perform(get("/images/" + appConfiguration.getAttachmentsFolderPath() + "/" + fileName)).andExpect(status().isOk()).andReturn();

        String cacheControl = result.getResponse().getHeaderValue("Cache-Control").toString();
        assertThat(cacheControl).containsIgnoringCase("max-age=31536000");
    }

    @AfterEach
    void tearDown() throws IOException {
        FileUtils.cleanDirectory(new File(appConfiguration.getFullProfileImagesPath()));
        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
    }
}
