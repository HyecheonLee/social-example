package com.hyecheon.socialexample.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Bean
    CommandLineRunner createUploadFolder() {
        return args -> {
            final File uploadFolder = new File("uploads-test");
            final boolean uploadFolderExist = uploadFolder.exists() && uploadFolder.isDirectory();
            if (!uploadFolderExist) {
                uploadFolder.mkdir();
            }
        };
    }
}
