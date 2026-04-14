package com.whatisbitcoin.price_service.service;

import com.whatisbitcoin.price_service.config.RabbitMQConfig;
import com.whatisbitcoin.price_service.dto.BitcoinPriceDTO;
import com.whatisbitcoin.price_service.dto.PriceAlertRequestDTO;
import com.whatisbitcoin.price_service.model.PriceAlert;
import com.whatisbitcoin.price_service.repository.PriceAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertService {

    private final PriceAlertRepository alertRepository;
    private final RabbitTemplate rabbitTemplate;

    public PriceAlert registerAlert(PriceAlertRequestDTO request) {
        PriceAlert alert = PriceAlert.builder()
                .email(request.getEmail())
                .targetPrice(request.getTargetPrice())
                .direction(PriceAlert.Direction.valueOf(request.getDirection().name()))
                .triggered(false)
                .build();

        PriceAlert saved = alertRepository.save(alert);
        log.info("Alert registered: {} {} ${} for {}",
                saved.getDirection(), saved.getTargetPrice(), saved.getEmail(), saved.getId());
        return saved;
    }

    public void checkAlerts(BitcoinPriceDTO currentPrice) {
        List<PriceAlert> pending = alertRepository.findByTriggeredFalse();

        for (PriceAlert alert : pending) {
            boolean triggered = switch (alert.getDirection()) {
                case ABOVE -> currentPrice.getPrice().compareTo(alert.getTargetPrice()) >= 0;
                case BELOW -> currentPrice.getPrice().compareTo(alert.getTargetPrice()) <= 0;
            };

            if (triggered) {
                alert.setTriggered(true);
                alert.setTriggeredAt(Instant.now());
                alertRepository.save(alert);

                Map<String, Object> event = new HashMap<>();
                event.put("email", alert.getEmail());
                event.put("targetPrice", alert.getTargetPrice());
                event.put("currentPrice", currentPrice.getPrice());
                event.put("direction", alert.getDirection().name());
                event.put("triggeredAt", alert.getTriggeredAt().toString());

                rabbitTemplate.convertAndSend(
                        RabbitMQConfig.EXCHANGE,
                        RabbitMQConfig.ROUTING_ALERT_TRIGGERED,
                        event);

                log.info("Alert triggered for {}: ${} reached", alert.getEmail(), alert.getTargetPrice());
            }
        }
    }
}
