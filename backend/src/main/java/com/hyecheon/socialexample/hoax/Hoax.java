package com.hyecheon.socialexample.hoax;

import com.hyecheon.socialexample.user.User;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Data
public class Hoax {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    @Size(min = 10, max = 5000)
    @Column(length = 5000)
    private String content;

    @CreationTimestamp
    private LocalDateTime timestamp;
}
