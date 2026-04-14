package com.whatisbitcoin.price_service.service;

import com.whatisbitcoin.price_service.dto.BitcoinPriceDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Slf4j
@Service
public class CoinGeckoService {

    private final WebClient webClient;
    private final String currency;

    @Value("${coingecko.api-key:}")
    private String apiKey;

    public CoinGeckoService(
            @Value("${coingecko.base-url}") String baseUrl,
            @Value("${coingecko.currency}") String currency) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        this.currency = currency;
    }

    @SuppressWarnings("unchecked")
    public BitcoinPriceDTO fetchCurrentPrice() {
        log.info("Fetching Bitcoin price from CoinGecko...");

        Map<String, Object> response = webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder
                            .path("/simple/price")
                            .queryParam("ids", "bitcoin")
                            .queryParam("vs_currencies", currency)
                            .queryParam("include_market_cap", "true")
                            .queryParam("include_24hr_vol", "true")
                            .queryParam("include_24hr_change", "true");
                    if (apiKey != null && !apiKey.isBlank()) {
                        builder = builder.queryParam("x_cg_demo_api_key", apiKey);
                    }
                    return builder.build();
                })
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        Map<String, Object> bitcoin = (Map<String, Object>) response.get("bitcoin");

        return BitcoinPriceDTO.builder()
                .price(toBigDecimal(bitcoin.get(currency)))
                .marketCap(toBigDecimal(bitcoin.get(currency + "_market_cap")))
                .volume24h(toBigDecimal(bitcoin.get(currency + "_24h_vol")))
                .change24h(toBigDecimal(bitcoin.get(currency + "_24h_change")))
                .timestamp(Instant.now())
                .build();
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        return new BigDecimal(value.toString());
    }
}
