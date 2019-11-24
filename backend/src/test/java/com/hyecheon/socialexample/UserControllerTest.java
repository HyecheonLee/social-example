package com.hyecheon.socialexample;

import com.hyecheon.socialexample.shared.GenericResponse;
import com.hyecheon.socialexample.user.User;
import com.hyecheon.socialexample.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserControllerTest {

    private static final String API_1_0_USERS = "/api/1.0/users";
    @Autowired
    TestRestTemplate testRestTemplate;
    @Autowired
    UserRepository userRepository;

    @BeforeEach
    void cleanup() {
        userRepository.deleteAll();
    }

    @Test
    void postUser_whenUserIsValid_receiveOK() {
        final User user = createValidUser();
        final var response = testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void postUser_whenUserIsValid_userSavedToDatabase() {
        final var user = createValidUser();
        testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void postUser_whenUserIsValid_receiveSuccessMessage() {
        final User user = createValidUser();
        final var response = testRestTemplate.postForEntity(API_1_0_USERS, user, GenericResponse.class);
        assertThat(response.getBody().getMessage()).isNotNull();
    }

    private User createValidUser() {
        final var user = new User();
        user.setUsername("test-user");
        user.setDisplayName("test-display");
        user.setPassword("Password");
        return user;
    }

}
