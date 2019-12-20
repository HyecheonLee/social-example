package com.hyecheon.socialexample;

import com.hyecheon.socialexample.user.User;

public class TestUtil {
    public static User createValidUser() {
        final var user = new User();
        user.setDisplayName("test-display");
        user.setUsername("test-user");
        user.setPassword("P4ssword");
        user.setImage("profile-image.png");
        return user;
    }

    public static User createValidUser(String username) {
        final User user = createValidUser();
        user.setUsername(username);
        return user;
    }
}
