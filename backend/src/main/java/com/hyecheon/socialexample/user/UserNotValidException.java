package com.hyecheon.socialexample.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserNotValidException extends RuntimeException {
    public UserNotValidException() {
    }

    public UserNotValidException(String message) {
        super(message);
    }

    public UserNotValidException(String message, Throwable cause) {
        super(message, cause);
    }
}
