package com.hyecheon.socialexample.user;

import com.hyecheon.socialexample.error.NotFoundException;
import com.hyecheon.socialexample.file.FileService;
import com.hyecheon.socialexample.user.vm.UserUpdateVM;
import com.hyecheon.socialexample.user.vm.UserVM;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.commons.CommonsFileUploadSupport;

import java.io.IOException;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;

    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Page<User> findAll(User user, int page, int size) {
        return findAll(user, PageRequest.of(page, size));
    }

    public Page<User> findAll(User loggedInUser, Pageable pageable) {
        if (loggedInUser != null) {
            return userRepository.findByUsernameNot(loggedInUser.getUsername(), pageable);
        }
        return userRepository.findAll(pageable);
    }

    public UserVM findByUsername(String username) {
        return userRepository.findByUsername(username).map(UserVM::new).orElseThrow(() -> new NotFoundException(username + " not found"));
    }

    public User update(Long id, UserUpdateVM userUpdate) {
        final User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("user id " + id + " not found"));
        if (StringUtils.hasText(userUpdate.getImage())) {
            try {
//                FilenameUtils.getExtension();
                final String savedImageName = fileService.saveProfileImage(userUpdate.getImage());
                fileService.deleteProfileImage(user.getImage());
                user.setImage(savedImageName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (StringUtils.hasText(userUpdate.getDisplayName())) {
            user.setDisplayName(userUpdate.getDisplayName());
        }
        return user;
    }
}

