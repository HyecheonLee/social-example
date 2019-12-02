package com.hyecheon.socialexample;

import com.hyecheon.socialexample.error.ApiError;
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
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void postUser_whenUserIsValid_userSavedToDatabase() {
        final var user = createValidUser();
        postSignup(user, Object.class);
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void postUser_whenUserIsValid_receiveSuccessMessage() {
        final User user = createValidUser();
        final var response = postSignup(user, GenericResponse.class);
        assertThat(response.getBody().getMessage()).isNotNull();
    }

    @Test
    void postUser_whenUserIsValid_passwordIsHashedInDatabase() {
        final var user = createValidUser();
        postSignup(user, Object.class);
        final var users = userRepository.findAll();
        final var inDB = users.get(0);
        assertThat(inDB.getPassword()).isNotEqualTo(user.getPassword());
    }

    @Test
    void postUser_whenUserHasNullUsername_receiveBadRequest() {
        final var user = createValidUser();
        user.setUsername(null);
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasNullDisplayName_receiveBadRequest() {
        final var user = createValidUser();
        user.setDisplayName(null);
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasNullPassword_receiveBadRequest() {
        final var user = createValidUser();
        user.setPassword(null);
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasNullUsernameWithLessThanRequired_receiveBadRequest() {
        final var user = createValidUser();
        user.setUsername("abc");
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasNullDisplayNameWithLessThanRequired_receiveBadRequest() {
        final var user = createValidUser();
        user.setDisplayName("abc");
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasNullPasswordWithLessThanRequired_receiveBadRequest() {
        final var user = createValidUser();
        user.setPassword("abc");
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasUsernameExceedsTheLengthLimit_receiveBadRequest() {
        final var user = createValidUser();
        final var valueOf256Chars = IntStream.rangeClosed(1, 256).mapToObj(x -> "a").collect(Collectors.joining());
        user.setUsername(valueOf256Chars);
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasDisplayNameExceedsTheLengthLimit_receiveBadRequest() {
        final var user = createValidUser();
        final var valueOf256Chars = IntStream.rangeClosed(1, 256).mapToObj(x -> "a").collect(Collectors.joining());
        user.setDisplayName(valueOf256Chars);
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasPasswordExceedsTheLengthLimit_receiveBadRequest() {
        final var user = createValidUser();
        final var valueOf256Chars = IntStream.rangeClosed(1, 256).mapToObj(x -> "a").collect(Collectors.joining());
        user.setPassword(valueOf256Chars + "A1");
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasPasswordWithAllLowercase_receiveBadRequest() {
        final var user = createValidUser();
        user.setPassword("allowercase");
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasPasswordWithAllUppercase_receiveBadRequest() {
        final var user = createValidUser();
        user.setPassword("ALLOWERCASE");
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserHasPasswordWithAllNumber_receiveBadRequest() {
        final var user = createValidUser();
        user.setPassword("123456789");
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenUserIsInvalid_receiveApiError() {
        final var user = new User();
        final var response = postSignup(user, ApiError.class);
        assertThat(response.getBody().getUrl()).isEqualTo(API_1_0_USERS);
    }

    @Test
    void postUser_whenUserIsInvalid_receiveApiErrorWithValidationErrors() {
        final var user = new User();
        final var response = postSignup(user, ApiError.class);
        assertThat(response.getBody().getValidationErrors().size()).isEqualTo(3);
    }

    @Test
    void postUser_whenUserHasNullUsername_receiveMessageOfNullErrorForUsername() {
        final var user = createValidUser();
        user.setUsername(null);
        final var repose = postSignup(user, ApiError.class);
        final var validationErrors = repose.getBody().getValidationErrors();
        assertThat(validationErrors.get("username")).isEqualTo("사용자 이름이 반드시 있어야합니다.");
    }

    @Test
    void postUser_whenUserHasNullPassword_receiveMessageOfNullErrorForUsername() {
        final var user = createValidUser();
        user.setPassword(null);
        final var repose = postSignup(user, ApiError.class);
        final var validationErrors = repose.getBody().getValidationErrors();
        assertThat(validationErrors.get("password")).isEqualTo("반드시 값이 있어야 합니다.");
    }

    @Test
    void postUser_whenUserHasInvalidLengthUsername_receiveGenericMessageOfSizeError() {
        final var user = createValidUser();
        user.setUsername("abc");
        final var response = postSignup(user, ApiError.class);
        final var validationErrors = response.getBody().getValidationErrors();
        assertThat(validationErrors.get("username")).isEqualTo("4~255자 사이의 값을 정해주세요");
    }

    @Test
    void postUser_whenUserHasInvalidPasswordPattern_receiveMessageOfPasswordPatternError() {
        final var user = createValidUser();
        user.setPassword("alllowercase");
        final var response = postSignup(user, ApiError.class);
        final var validationErrors = response.getBody().getValidationErrors();
        assertThat(validationErrors.get("password")).isEqualTo("형식이 안맞아");
    }

    @Test
    void postUser_whenAnotherUserHasSameUsername_receiveBadRequest() {
        userRepository.save(createValidUser());

        final var user = createValidUser();
        final var response = postSignup(user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postUser_whenAnotherUserHasSameUsername_receiveMessageOfDuplicateUsername() {
        userRepository.save(createValidUser());

        final var user = createValidUser();
        final var response = postSignup(user, ApiError.class);
        final var validationErrors = response.getBody().getValidationErrors();
        assertThat(validationErrors.get("username")).isEqualTo("이미 존재하는 이름 입니다.");
    }

    public <T> ResponseEntity<T> postSignup(Object request, Class<T> response) {
        return testRestTemplate.postForEntity(API_1_0_USERS, request, response);
    }

    private User createValidUser() {
        final var user = new User();
        user.setUsername("test-user");
        user.setDisplayName("test-display");
        user.setPassword("Password123");
        return user;
    }

}
