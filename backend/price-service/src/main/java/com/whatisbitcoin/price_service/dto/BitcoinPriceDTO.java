package com.whatisbitcoin.price_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BitcoinPriceDTO {

    private BigDecimal price;

    @JsonProperty("market_cap")
    private BigDecimal marketCap;

    @JsonProperty("volume_24h")
    private BigDecimal volume24h;

    @JsonProperty("change_24h")
    private BigDecimal change24h;

    private Instant timestamp;
}
