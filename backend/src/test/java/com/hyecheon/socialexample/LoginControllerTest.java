package com.hyecheon.socialexample;

import com.hyecheon.socialexample.error.ApiError;
import com.hyecheon.socialexample.user.User;
import com.hyecheon.socialexample.user.UserRepository;
import com.hyecheon.socialexample.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class LoginControllerTest {
    private static final String API_1_0_LOGIN = "/api/1.0/login";

    @Autowired
    TestRestTemplate testRestTemplate;
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    @Test
    void postLogin_withoutUserCredentials_receiveUnauthorized() {
        final var response = login(Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void postLogin_withIncorrectCredentials_receiveUnauthorized() {
        authenticate();
        final var reponse = login(Object.class);
        assertThat(reponse.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void postLogin_withoutUserCredentials_receiveApiError() {
        final var reponse = login(ApiError.class);
        assertThat(reponse.getBody().getUrl()).isEqualTo(API_1_0_LOGIN);
    }

    @Test
    void postLogin_withoutUserCredentials_receiveApiErrorWithoutValidationErrors() {
        final var response = login(String.class);
        assertThat(response.getBody().contains("validationErrors")).isFalse();
    }

    @Test
    void postLogin_withIncorrectCredentials_receiveUnauthorizedWithoutWWWAuthenticationHeader() {
        authenticate();
        final var response = login(Object.class);
        assertThat(response.getHeaders().containsKey("WWW-Authenticate")).isFalse();
    }

    @Test
    void postLogin_withValidCredentials_receiveOk() {
        final var user = TestUtil.createValidUser();
        userService.save(user);
        authenticate();
        final var response = login(Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void postLogin_withValidCredentials_receiveLoggedInUserId() {
        final var inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        final var response = login(new ParameterizedTypeReference<Map<String, Object>>() {
        });
        final var body = response.getBody();
        final var id = (Integer) body.get("id");
        assertThat(id).isEqualTo(inDB.getId());
    }

    @Test
    void postLogin_withValidCredentials_receiveLoggedInUsersImage() {
        final var inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        final var response = login(new ParameterizedTypeReference<Map<String, Object>>() {
        });
        final var body = response.getBody();
        final var image = (String) body.get("image");
        assertThat(image).isEqualTo(inDB.getImage());
    }

    @Test
    void postLogin_withValidCredentials_receiveLoggedInUsersDisplayName() {
        final var inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        final var response = login(new ParameterizedTypeReference<Map<String, Object>>() {
        });
        final var body = response.getBody();
        final var displayName = (String) body.get("displayName");
        assertThat(displayName).isEqualTo(inDB.getDisplayName());
    }

    @Test
    void postLogin_withValidCredentials_receiveLoggedInUsersUsername() {
        final var inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        final var response = login(new ParameterizedTypeReference<Map<String, Object>>() {
        });
        final var body = response.getBody();
        final var username = (String) body.get("username");
        assertThat(username).isEqualTo(inDB.getUsername());
    }

    @Test
    void postLogin_withValidCredentials_notReceiveLoggedInUsersPassword() {
        final var inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        final var response = login(new ParameterizedTypeReference<Map<String, Object>>() {
        });
        final var body = response.getBody();
        assertThat(body.containsKey("password")).isFalse();
    }

    private void authenticate() {
        final var user = TestUtil.createValidUser();
        testRestTemplate.getRestTemplate().getInterceptors().add(new BasicAuthenticationInterceptor(user.getUsername(), user.getPassword()));
    }

    public <T> ResponseEntity<T> login(Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_LOGIN, null, responseType);
    }

    public <T> ResponseEntity<T> login(ParameterizedTypeReference<T> responseType) {
        return testRestTemplate.exchange(API_1_0_LOGIN, HttpMethod.POST, null, responseType);
    }
}
