package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HoaxSecurityService {
    private final HoaxRepository hoaxRepository;

    public boolean isAllowedToDelete(Long hoaxId, User loggedInUser) {
        return hoaxRepository.existsByUserAndId(loggedInUser, hoaxId);
    }
}
