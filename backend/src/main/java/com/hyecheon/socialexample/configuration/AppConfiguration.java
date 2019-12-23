package com.hyecheon.socialexample.configuration;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "rainbow")
@Data
public class AppConfiguration {

    private String uploadPath;
    private String profileImageFolder = "profile";
    private String attachmentsFolderPath = "attachments";

    public String getFullProfileImagePath() {
        return uploadPath + "/" + profileImageFolder;
    }

    public String getFullAttachmentsPath() {
        return uploadPath + "/" + attachmentsFolderPath;
    }
}
