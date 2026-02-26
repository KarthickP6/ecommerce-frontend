package com.meenatchi.furniture.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private long id;
    private String name;
    private String description;
    private String imageUrl;
}

