package com.whatisbitcoin.notification_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.whatisbitcoin.notification_service.config.RabbitMQConfig;
import com.whatisbitcoin.notification_service.service.EmailService;
import com.whatisbitcoin.notification_service.websocket.PriceWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PriceEventConsumer {

    private final PriceWebSocketHandler webSocketHandler;
    private final EmailService emailService;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    // ── Consumes price updates → broadcasts via WebSocket ──
    @RabbitListener(queues = RabbitMQConfig.QUEUE_PRICE_UPDATED)
    public void onPriceUpdated(Map<String, Object> payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            webSocketHandler.broadcast(json);
            log.info("Price broadcast via WebSocket: {}", payload.get("price"));
        } catch (Exception e) {
            log.error("Error processing price update: {}", e.getMessage());
        }
    }

    // ── Consumes alert triggers → sends email ──────────────
    @RabbitListener(queues = RabbitMQConfig.QUEUE_ALERT_TRIGGERED)
    public void onAlertTriggered(Map<String, Object> payload) {
        try {
            String email       = (String) payload.get("email");
            BigDecimal target  = new BigDecimal(payload.get("targetPrice").toString());
            BigDecimal current = new BigDecimal(payload.get("currentPrice").toString());
            String direction   = (String) payload.get("direction");

            emailService.sendPriceAlert(email, target, current, direction);
        } catch (Exception e) {
            log.error("Error processing alert trigger: {}", e.getMessage());
        }
    }
}
