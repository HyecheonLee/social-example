package com.hyecheon.socialexample.user.vm;

import com.hyecheon.socialexample.user.User;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Data
public class UserUpdateVM {
    private String displayName;
    private String image;

    public User updatedUser(User user) {
        if (StringUtils.hasText(displayName)) {
            user.setDisplayName(displayName);
        }
        if (StringUtils.hasText(image)) {
            user.setImage(user.getUsername() + UUID.randomUUID().toString().replaceAll("_", ""));
        }
        return user;
    }
}
