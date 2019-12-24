package com.hyecheon.socialexample.shared;

import com.hyecheon.socialexample.file.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Base64Utils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@RequiredArgsConstructor
public class ProfileImageValidator implements ConstraintValidator<ProfileImage, String> {
    private final FileService fileService;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        byte[] decodedBytes = Base64Utils.decodeFromString(value);
        final String fileType = fileService.detectType(decodedBytes);
        return fileType.equalsIgnoreCase("image/png") || fileType.equalsIgnoreCase("image/jpeg");
    }
}
