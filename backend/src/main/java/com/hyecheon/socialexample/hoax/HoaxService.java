package com.hyecheon.socialexample.hoax;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HoaxService {
    private final HoaxRepository hoaxRepository;

    public Hoax save(Hoax hoax) {
        return hoaxRepository.save(hoax);
    }
}
