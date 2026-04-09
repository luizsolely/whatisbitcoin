package com.whatisbitcoin.price_service.scheduler;

import com.whatisbitcoin.price_service.dto.BitcoinPriceDTO;
import com.whatisbitcoin.price_service.service.AlertService;
import com.whatisbitcoin.price_service.service.CoinGeckoService;
import com.whatisbitcoin.price_service.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PriceScheduler {

    private final CoinGeckoService coinGeckoService;
    private final PriceService priceService;
    private final AlertService alertService;

    @Scheduled(fixedRateString = "${price.scheduler.interval-ms}")
    public void fetchAndProcess() {
        try {
            BitcoinPriceDTO dto = coinGeckoService.fetchCurrentPrice();
            priceService.updatePrice(dto);
            alertService.checkAlerts(dto);
        } catch (Exception e) {
            log.error("Error during price fetch cycle: {}", e.getMessage(), e);
        }
    }
}
