package com.hyecheon.socialexample.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
@RequiredArgsConstructor
public class WebConfiguration implements WebMvcConfigurer {

    private final AppConfiguration appConfiguration;

    @Bean
    CommandLineRunner createUploadFolder() {
        return args -> {
            createNotExistingFolder(appConfiguration.getUploadPath());
            createNotExistingFolder(appConfiguration.getFullProfileImagePath());
            createNotExistingFolder(appConfiguration.getAttachmentsFolderPath());
        };
    }

    private void createNotExistingFolder(String path) {
        final File folder = new File(path);
        final boolean folderExist = folder.exists() && folder.isDirectory();
        if (!folderExist) {
            folder.mkdir();
        }
    }
}
