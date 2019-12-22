package com.hyecheon.socialexample.user.vm;

import com.hyecheon.socialexample.user.User;
import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class UserUpdateVM {
    private String displayName;

    public User updatedUser(User user) {
        if (StringUtils.hasText(displayName)) {
            user.setDisplayName(displayName);
        }
        return user;
    }
}
