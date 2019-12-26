package com.hyecheon.socialexample.hoax.vm;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hyecheon.socialexample.hoax.Hoax;
import com.hyecheon.socialexample.user.vm.UserVM;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class HoaxVM {
    private Long id;
    private UserVM user;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;


    public HoaxVM(Hoax hoax) {
        id = hoax.getId();
        user = new UserVM(hoax.getUser());
        content = hoax.getContent();
        timestamp = hoax.getTimestamp();
    }
}
