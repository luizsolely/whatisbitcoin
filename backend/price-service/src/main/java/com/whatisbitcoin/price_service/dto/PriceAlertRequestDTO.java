package com.whatisbitcoin.price_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PriceAlertRequestDTO {

    @Email
    @NotBlank
    private String email;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal targetPrice;

    @NotNull
    private Direction direction;

    public enum Direction {
        ABOVE, BELOW
    }
}
