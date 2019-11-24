package com.hyecheon.socialexample.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class User {

    private String username;
    private String displayName;
    private String password;
}
