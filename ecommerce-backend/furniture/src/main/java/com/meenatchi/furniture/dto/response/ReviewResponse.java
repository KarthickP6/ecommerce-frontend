package com.meenatchi.furniture.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private long id;
    private String title;
    private String comment;
    private Integer rating;
    private UserResponse user;
    private LocalDateTime createdAt;
}

