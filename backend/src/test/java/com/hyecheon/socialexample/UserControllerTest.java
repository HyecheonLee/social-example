package com.hyecheon.socialexample;

import com.hyecheon.socialexample.configuration.AppConfiguration;
import com.hyecheon.socialexample.error.ApiError;
import com.hyecheon.socialexample.shared.GenericResponse;
import com.hyecheon.socialexample.user.TestPage;
import com.hyecheon.socialexample.user.User;
import com.hyecheon.socialexample.user.UserRepository;
import com.hyecheon.socialexample.user.UserService;
import com.hyecheon.socialexample.user.vm.UserUpdateVM;
import com.hyecheon.socialexample.user.vm.UserVM;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.Base64Utils;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.hyecheon.socialexample.TestUtil.createValidUser;
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
    @Autowired
    private UserService userService;

    @Autowired
    AppConfiguration appConfiguration;

    @BeforeEach
    void cleanup() {
        userRepository.deleteAll();
    }

    @AfterEach
    void tearDown() {
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

    @Test
    public void getUsers_whenThereAreNoUsersInDB_receiveOK() {
        ResponseEntity<TestPage<?>> response = getUsers(new ParameterizedTypeReference<>() {
        });

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getUsers_whenThereAreNoUsersInDB_receivePageWithZeroItems() {
        final ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getUsers_whenThereIsAUserInDB_receivePageWithUser() {
        userRepository.save(TestUtil.createValidUser());
        final ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<>() {
        });
        assertThat(response.getBody().getNumberOfElements()).isEqualTo(1);
    }

    @Test
    void getUsers_whenThereIsAUserInDB_receiveUserWithoutPassword() {
        userRepository.save(TestUtil.createValidUser());
        var response = getUsers(new ParameterizedTypeReference<TestPage<Map<String, Object>>>() {
        });

        final Map<String, Object> entity = response.getBody().getContent().get(0);
        System.out.println(entity);
        assertThat(entity.containsKey("password")).isFalse();
    }

    @Test
    void getUsers_whenPageIsRequestedFor3ItemsPerPageWhereTheDatabaseHas20Users_receive3Users() {
        IntStream.rangeClosed(1, 20).mapToObj(i -> "test-user-" + 1)
                .map(TestUtil::createValidUser)
                .forEach(user -> userRepository.save(user));

        String path = API_1_0_USERS + "?page=0&size=3";
        final ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getContent().size()).isEqualTo(3);
        assertThat(response.getBody().getSize()).isEqualTo(3);
    }

    @Test
    void getUsers_whenPageSizeNotProvided_receivePageSizeAs10() {
        final ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getSize()).isEqualTo(10);
    }

    @Test
    void getUsers_whenPageSizeIsGreaterThan100_receivePageSizeAs100() {
        String path = API_1_0_USERS + "?page=0&size=500";
        final ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getSize()).isEqualTo(100);
    }

    @Test
    void getUsers_whenPageSizeIsNegative_receivePageSizeAs10() {
        String path = API_1_0_USERS + "?page=0&size=-5";
        final ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getSize()).isEqualTo(10);
    }

    @Test
    void getUsers_whenPageSizeIsNegative_receiveFirstPage() {
        String path = API_1_0_USERS + "?page=-5";
        final ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getNumber()).isEqualTo(0);
    }

    @Test
    void getUsers_whenUserLoggedIn_receivePageWithoutLoggedInUser() {
        userService.save(TestUtil.createValidUser("user1"));
        userService.save(TestUtil.createValidUser("user2"));
        userService.save(TestUtil.createValidUser("user3"));
        authenticate("user1");
        final ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {
        });
        assertThat(response.getBody().getTotalElements()).isEqualTo(2);
    }

    @Test
    void getUserByUsername_whenUserExist_receiveOk() {
        String username = "test-user";
        userService.save(TestUtil.createValidUser(username));
        final ResponseEntity<Object> response = getUser(username, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void getUserByUsername_whenUserExist_receiveUserWithoutPassword() {
        String username = "test-user";
        userService.save(TestUtil.createValidUser(username));
        final ResponseEntity<String> response = getUser(username, String.class);
        assertThat(Objects.requireNonNull(response.getBody()).contains("password")).isFalse();
    }

    @Test
    void getUserByUsername_whenUserDoesNotExist_receiveNotFound() {
        final ResponseEntity<Object> response = getUser("unknown-user", Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getUserByUsername_whenUserDoesNotExist_receiveApiError() {
        final ResponseEntity<ApiError> response = getUser("unknown-user", ApiError.class);
        assertThat(response.getBody().getMessage().contains("unknown-user")).isTrue();
    }

    @Test
    void putUser_whenUnauthorizedUserSendsTheRequest_receiveUnauthorized() {
        final ResponseEntity<Object> response = putUser(123, null, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void putUser_whenAuthorizedUserSendsUpdateForAnotherUser_receiveForbidden() {
        final User user = userService.save(createValidUser("user1"));
        authenticate("user1");
        final ResponseEntity<Object> response = putUser(user.getId() + 1, null, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void putUser_whenUnauthorizedUserSendsTheRequest_receiveApiError() {
        final ResponseEntity<ApiError> response = putUser(123, null, ApiError.class);
        assertThat(response.getBody().getUrl()).contains("users/123");
    }

    @Test
    void putUser_whenAuthorizedUserSendsUpdateForAnotherUser_receiveApiError() {
        final User user = userService.save(createValidUser("user1"));
        authenticate("user1");
        final long anotherUserId = user.getId() + 1;
        var response = putUser(anotherUserId, null, ApiError.class);
        assertThat(response.getBody().getUrl()).contains("users/" + anotherUserId);
    }

    @Test
    void putUser_whenValidRequestBodyFromAuthorizedUser_receiveOk() {
        final User user = userService.save(createValidUser("user1"));
        authenticate("user1");
        final UserUpdateVM updateUser = createValidUserUpdateVM();

        var requestEntity = new HttpEntity<>(updateUser);
        var response = putUser(user.getId(), requestEntity, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void putUser_whenValidRequestBodyFromAuthorizedUser_displayNameUpdated() {
        final User user = userService.save(createValidUser("user1"));
        authenticate("user1");
        final UserUpdateVM updateUser = createValidUserUpdateVM();

        var requestEntity = new HttpEntity<>(updateUser);
        putUser(user.getId(), requestEntity, Object.class);

        final User userInDB = userRepository.findByUsername("user1").get();
        assertThat(userInDB.getDisplayName()).isEqualTo(updateUser.getDisplayName());
    }

    @Test
    void putUser_whenValidRequestBodyFromAuthorizedUser_receiveUserVMWithUpdatedDisplayName() {
        final User user = userService.save(createValidUser("user1"));
        authenticate("user1");
        final UserUpdateVM updateUser = createValidUserUpdateVM();

        var requestEntity = new HttpEntity<>(updateUser);
        final ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);

        assertThat(response.getBody().getDisplayName()).isEqualTo(updateUser.getDisplayName());
    }

    @Test
    void putUser_withValidRequestBodyWithSupportedImageFromAuthorizedUser_receiveUserVMWithRandomImageName() throws IOException {
        final User user = userService.save(createValidUser("user1"));
        authenticate("user1");
        final UserUpdateVM updateUser = createValidUserUpdateVM();
        final String imageString = readFileToBase64("profile.png");
        updateUser.setImage(imageString);

        var requestEntity = new HttpEntity<>(updateUser);
        final ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);

        assertThat(response.getBody().getImage()).isNotEqualTo("profile-image.png");
    }

    @Test
    void putUser_withValidRequestBodyWithSupportedImageFromAuthorizedUser_imageIsStoredUnderProfileFolder() throws IOException {
        final User user = userService.save(createValidUser("user1"));
        authenticate("user1");
        final UserUpdateVM updateUser = createValidUserUpdateVM();
        final String imageString = readFileToBase64("profile.png");
        updateUser.setImage(imageString);

        var requestEntity = new HttpEntity<>(updateUser);
        final ResponseEntity<UserVM> response = putUser(user.getId(), requestEntity, UserVM.class);

        final String storedImageName = response.getBody().getImage();
        final String profilePicturePath = appConfiguration.getFullProfileImagePath() + "/" + storedImageName;

        final File storedImage = new File(profilePicturePath);

        assertThat(storedImage.exists()).isTrue();
    }

    @AfterEach
    void clearDir() throws IOException {
        FileUtils.cleanDirectory(new File(appConfiguration.getFullProfileImagePath()));
        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
    }

    private String readFileToBase64(String fileName) throws IOException {
        final ClassPathResource imageResource = new ClassPathResource(fileName);
        final byte[] imageArr = FileUtils.readFileToByteArray(imageResource.getFile());
        final String imageString = Base64Utils.encodeToString(imageArr);
        return imageString;
    }

    private UserUpdateVM createValidUserUpdateVM() {
        final UserUpdateVM updateUser = new UserUpdateVM();
        updateUser.setDisplayName("newDisplayName");
        return updateUser;
    }

    private void authenticate(String username) {
        testRestTemplate.getRestTemplate().getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword"));
    }

    private <T> ResponseEntity<T> getUsers(ParameterizedTypeReference<T> parameter) {
        return testRestTemplate.exchange(API_1_0_USERS, HttpMethod.GET, null, parameter);
    }

    private <T> ResponseEntity<T> getUsers(String path, ParameterizedTypeReference<T> parameter) {
        return testRestTemplate.exchange(path, HttpMethod.GET, null, parameter);
    }


    public <T> ResponseEntity<T> postSignup(Object request, Class<T> response) {
        return testRestTemplate.postForEntity(API_1_0_USERS, request, response);
    }

    public <T> ResponseEntity<T> getUser(String username, Class<T> responseType) {
        final String path = API_1_0_USERS + "/" + username;
        return testRestTemplate.getForEntity(path, responseType);
    }

    public <T> ResponseEntity<T> putUser(long id, HttpEntity<?> requestEntity, Class<T> responseType) {
        final String path = API_1_0_USERS + "/" + id;
        return testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, responseType);
    }
}