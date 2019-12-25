package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.TestUtil;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceUnit;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")

public class HoaxControllerTest {
    public static final String API_1_0_HOAXES = "/api/1.0/hoaxes";
    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private HoaxRepository hoaxRepository;

    @PersistenceUnit
    EntityManagerFactory entityManagerFactory;

    @BeforeEach
    void cleanup() {
        hoaxRepository.deleteAll();
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    @Test
    void postHoax_WhenHoaxIsValidAndUserIsAuthorized_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();

        final ResponseEntity<Object> response = postHoax(hoax, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void postHoax_WhenHoaxIsValidAndUserIsUnAuthorized_receiveUnauthorized() {
        final Hoax hoax = TestUtil.createValidHoax();
        final ResponseEntity<Object> response = postHoax(hoax, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void postHoax_WhenHoaxIsValidAndUserIsUnAuthorized_receiveApiError() {
        final Hoax hoax = TestUtil.createValidHoax();
        final ResponseEntity<ApiError> response = postHoax(hoax, ApiError.class);
        assertThat(response.getBody().getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    void postHoax_whenHoaxIsValidAndUserIsAuthorized_hoaxSavedToDatabase() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        postHoax(hoax, Object.class);

        assertThat(hoaxRepository.count()).isEqualTo(1);
    }

    @Test
    void postHoax_whenHoaxIsValidAndUserIsAuthorized_hoaxSavedToDatabaseWithTimestamp() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        final ResponseEntity<Hoax> response = postHoax(hoax, Hoax.class);

        final Hoax findHoax = hoaxRepository.findById(response.getBody().getId()).get();
        assertThat(findHoax.getTimestamp()).isNotNull();
    }

    @Test
    void postHoax_WhenHoaxContentNullAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        hoax.setContent("");

        final ResponseEntity<Object> response = postHoax(hoax, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postHoax_WhenHoaxContentLessThan10CharactersAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        hoax.setContent("aaa");

        final ResponseEntity<Object> response = postHoax(hoax, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postHoax_WhenHoaxContentIs5000CharactersAndUserIsAuthorized_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        final String characters5000 = IntStream.rangeClosed(1, 5000).mapToObj(value -> "a").collect(Collectors.joining());
        hoax.setContent(characters5000);

        final ResponseEntity<Object> response = postHoax(hoax, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void postHoax_WhenHoaxContentMoreThan5000CharactersAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        final String characters5000 = IntStream.rangeClosed(1, 5001).mapToObj(value -> "a").collect(Collectors.joining());
        hoax.setContent(characters5000);
        System.out.println(characters5000.length());

        final ResponseEntity<Object> response = postHoax(hoax, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void postHoax_whenHoaxContentNullAndUserIsAuthorized_receiveApiErrorWithValidationErrors() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        hoax.setContent("");
        final ResponseEntity<ApiError> response = postHoax(hoax, ApiError.class);
        assertThat(response.getBody().getValidationErrors().get("content")).isNotNull();
    }

    @Test
    void postHoax_whenHoaxIsValidAndUserIsAuthorized_hoaxSavedWithAuthenticatedUserInfo() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        final ResponseEntity<Hoax> response = postHoax(hoax, Hoax.class);

        final EntityManager em = entityManagerFactory.createEntityManager();
        final EntityTransaction tx = em.getTransaction();
        tx.begin();

        final Hoax inDB = em.find(Hoax.class, response.getBody().getId());
        assertThat(inDB.getUser().getUsername()).isEqualTo("user1");

        tx.commit();
    }

    @Test
    void postHoax_whenHoaxIsValidAndUserIsAuthorized_hoaxCanBeAccessedFromUserEntity() {
        final User savedUser = userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final EntityManager em = entityManagerFactory.createEntityManager();
        final EntityTransaction tx = em.getTransaction();
        tx.begin();
        final Hoax hoax = TestUtil.createValidHoax();
        postHoax(hoax, Object.class);
        final User user = em.find(User.class, savedUser.getId());
        assertThat(user.getHoaxes().size()).isEqualTo(1);
        tx.commit();
    }


    private <T> ResponseEntity<T> postHoax(Hoax hoax, Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_HOAXES, hoax, responseType);
    }


    private void authenticate(final String username) {
        testRestTemplate.getRestTemplate()
                .getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword"));
    }
}
