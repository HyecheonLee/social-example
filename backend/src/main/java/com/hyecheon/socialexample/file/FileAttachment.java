package com.hyecheon.socialexample.file;

import com.hyecheon.socialexample.hoax.Hoax;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
public class FileAttachment {

    @Id
    @GeneratedValue
    private long id;

//    @Column(updatable = false)
//    @CreationTimestamp
    private LocalDateTime createdAt;

    private String name;

    private String fileType;

    @OneToOne
    @JoinColumn(name = "hoax_id")
    private Hoax hoax;

}