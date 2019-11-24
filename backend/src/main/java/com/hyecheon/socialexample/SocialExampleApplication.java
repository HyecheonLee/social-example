package com.hyecheon.socialexample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class SocialExampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialExampleApplication.class, args);
    }

}
