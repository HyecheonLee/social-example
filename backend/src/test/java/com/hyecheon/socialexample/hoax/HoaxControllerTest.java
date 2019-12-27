package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.TestUtil;
import com.hyecheon.socialexample.error.ApiError;
import com.hyecheon.socialexample.hoax.vm.HoaxVM;
import com.hyecheon.socialexample.TestPage;
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

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceUnit;
import java.time.LocalDateTime;
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

    @Autowired
    private HoaxService hoaxService;
    @PersistenceUnit
    EntityManagerFactory entityManagerFactory;

    @BeforeEach
    void cleanup() {
        hoaxRepository.deleteAll();
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    @Test
    void postHoax_WhenHoaxIsValidAndUserIsAuthorized_receiveCREATED() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();

        final ResponseEntity<Object> response = postHoax(hoax, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
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
        final ResponseEntity<HoaxVM> response = postHoax(hoax, HoaxVM.class);

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
    void postHoax_WhenHoaxContentIs5000CharactersAndUserIsAuthorized_receiveCREATED() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        final String characters5000 = IntStream.rangeClosed(1, 5000).mapToObj(value -> "a").collect(Collectors.joining());
        hoax.setContent(characters5000);

        final ResponseEntity<Object> response = postHoax(hoax, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
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
        final ResponseEntity<HoaxVM> response = postHoax(hoax, HoaxVM.class);

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

    @Test
    void getHoaxes_whenThereAreNoHoaxes_receiveOk() {
        final ResponseEntity<Object> response = getHoax(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getHoaxes_whenThereAreNoHoaxes_receivePageWithZeroItems() {
        final ResponseEntity<TestPage<Object>> response = getHoax(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    void getHoaxes_whenThereAreHoaxes_receivePageWithItems() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<Object>> response = getHoax(new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    void getHoaxes_whenThereAreHoaxes_receivePageWithHoaxVM() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<HoaxVM>> response = getHoax(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getContent().get(0).getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    void postHoax_whenHoaxIsValidAndUserIsAuthorized_receiveHoaxVM() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        final Hoax hoax = TestUtil.createValidHoax();
        final ResponseEntity<HoaxVM> response = postHoax(hoax, HoaxVM.class);
        assertThat(response.getBody().getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    void getHoaxesOfUser_whenUserExists_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        final ResponseEntity<Object> response = getHoaxesOfUser("user1", new ParameterizedTypeReference<Object>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getHoaxesOfUser_whenUserDoesNotExist_receiveNotFound() {
        final ResponseEntity<Object> response = getHoaxesOfUser("unknown-user", new ParameterizedTypeReference<Object>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getHoaxesOfUser_whenUserExists_receivePageWithZeroHoaxes() {
        userService.save(TestUtil.createValidUser("user1"));
        final var response = getHoaxesOfUser("user1", new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    void getHoaxesOfUser_whenUserExistWitHoax_receivePageWithHoaxVM() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<HoaxVM>> response = getHoaxesOfUser("user1", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getContent().get(0).getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    void getHoaxesOfUser_whenUserExistWitMultipleHoaxes_receivePageWithMatchingHoaxesCount() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<HoaxVM>> response = getHoaxesOfUser("user1", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    void getHoaxesOfUser_whenMultipleUserExistWithMultipleHoaxes_receivePageWithMatchingHoaxesCount() {
        User user1 = userService.save(TestUtil.createValidUser("user1"));
        IntStream.rangeClosed(1, 3).forEach(i -> {
            hoaxService.save(user1, TestUtil.createValidHoax());
        });
        User user2 = userService.save(TestUtil.createValidUser("user2"));
        IntStream.rangeClosed(1, 5).forEach(i -> {
            hoaxService.save(user2, TestUtil.createValidHoax());
        });

        final ResponseEntity<TestPage<HoaxVM>> response = getHoaxesOfUser("user2", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(5);
    }

    @Test
    void getOldHoaxes_whenThereAreNOHoaxes_receiveOk() {
        final ResponseEntity<Object> response = getOldHoaxes(5L, new ParameterizedTypeReference<>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getOldHoaxes_whenTHereAreHoaxes_receivePageWithItemsProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<Object>> response = getOldHoaxes(fourth.getId(), new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    void getOldHoaxes_whenTHereAreHoaxes_receivePageWithHoaxVMProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<HoaxVM>> response = getOldHoaxes(fourth.getId(), new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getContent().get(0).getTimestamp()).isBefore(LocalDateTime.now());
    }

    @Test
    void getOldHoaxesOfUser_whenUserExistThereAreNoHoaxes_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        final ResponseEntity<TestPage<Object>> response = getOldHoaxesOfUser(5, "user1", new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getOldHoaxesOfUser_whenUserExistAndThereAreHoaxes_receivePageWithItemsProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<Object>> response = getOldHoaxesOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    void getOldHoaxesOfUser_whenUserExistAndThereAreHoaxes_receivePageWithHoaxVmBeforeProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<HoaxVM>> response = getOldHoaxesOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getContent().get(0).getTimestamp()).isBefore(LocalDateTime.now());
    }

    @Test
    void getOldHoaxesOfUser_whenUserDoesNotExistThereAreNoHoaxes_receiveNotFound() {
        final ResponseEntity<TestPage<HoaxVM>> response = getOldHoaxesOfUser(5, "user1", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getOldHoaxesOfUser_whenUserExistAndThereAreHoaxes_receivePageWithZeroItemsBeforeProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        userService.save(TestUtil.createValidUser("user2"));

        final ResponseEntity<TestPage<HoaxVM>> response = getOldHoaxesOfUser(fourth.getId(), "user2", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    void getNewHoaxes_whenTHereAreHoaxes_receiveListOfItemsAfterProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<HoaxVM>> response = getNewHoaxes(fourth.getId(), new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(1);
    }

    @Test
    void getNewHoaxesOfUser_whenUserExistThereAreNoHoaxes_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        final ResponseEntity<Object> response = getNewHoaxesOfUser(5, "user1", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getNewHoaxesOfUser_whenUserExistThereAreHoaxes_receiveListWithItemsAfterProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<HoaxVM>> response = getNewHoaxesOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getContent().get(0).getTimestamp()).isBefore(LocalDateTime.now());
    }

    @Test
    void getNewHoaxesOfUser_whenUserDoesNotExistThereAreNoHoaxes_receiveNotFound() {
        final ResponseEntity<Object> response = getNewHoaxesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {
        });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getOldHoaxesOfUser_whenUserExistAndThereAreHoaxes_receivePageWithZeroItemsAfterProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        userService.save(TestUtil.createValidUser("user2"));

        final ResponseEntity<TestPage<HoaxVM>> response = getNewHoaxesOfUser(fourth.getId(), "user2", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    void getOldHoaxesCount_whenUserExistAndThereAreHoaxes_receiveCountAfterProvidedId() {
        final User user = userService.save(TestUtil.createValidUser("user1"));
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        final Hoax fourth = hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());
        hoaxService.save(user, TestUtil.createValidHoax());

        final ResponseEntity<TestPage<HoaxVM>> response = getNewHoaxesOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(8);
    }


    private <T> ResponseEntity<T> getNewHoaxes(long hoaxId, ParameterizedTypeReference<T> responseType) {
        String path = API_1_0_HOAXES + "/" + hoaxId + "?direction=after&page=0&size=5&sort=id,asc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getNewHoaxesCount(long hoaxId, ParameterizedTypeReference<T> responseType) {
        String path = API_1_0_HOAXES + "/" + hoaxId + "?direction=after&page=0&size=5&sort=id,asc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getNewHoaxesOfUser(long hoaxId, String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/hoaxes/" + hoaxId + "?direction=after&page=0&size=5&sort=id,asc";
        System.out.println(path);
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getOldHoaxes(long hoaxId, ParameterizedTypeReference<T> responseType) {
        String path = API_1_0_HOAXES + "/" + hoaxId + "?direction=before&page=0&size=5&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getOldHoaxesOfUser(long hoaxId, String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/hoaxes/" + hoaxId + "?direction=before&page=0&size=5&sort=id,desc";
        System.out.println(path);
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getHoaxesOfUser(String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/hoaxes";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getHoax(ParameterizedTypeReference<T> responseType) {
        return testRestTemplate.exchange(API_1_0_HOAXES, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> postHoax(Hoax hoax, Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_HOAXES, hoax, responseType);
    }


    private void authenticate(final String username) {
        testRestTemplate.getRestTemplate()
                .getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword"));
    }
}
