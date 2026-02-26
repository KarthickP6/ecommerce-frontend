package com.meenatchi.furniture.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    @NotBlank(message = "Payment method is required")
    private String method;

    private String cardNumber;

    private String cardName;

    private String cardExpiry;

    private String cardCvv;

    private String transactionId;
}

