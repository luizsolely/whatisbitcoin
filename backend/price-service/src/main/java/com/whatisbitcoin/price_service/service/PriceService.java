package com.whatisbitcoin.price_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.whatisbitcoin.price_service.config.RabbitMQConfig;
import com.whatisbitcoin.price_service.dto.BitcoinPriceDTO;
import com.whatisbitcoin.price_service.model.PriceSnapshot;
import com.whatisbitcoin.price_service.repository.PriceSnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceService {

    private static final String CACHE_KEY = "bitcoin:price:current";

    private final PriceSnapshotRepository snapshotRepository;
    private final RabbitTemplate rabbitTemplate;
    private final RedisTemplate<String, String> redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public void updatePrice(BitcoinPriceDTO dto) {
        try {
            String json = objectMapper.writeValueAsString(dto);
            redisTemplate.opsForValue().set(CACHE_KEY, json, Duration.ofSeconds(60));
            log.info("Price cached in Redis: ${}", dto.getPrice());
        } catch (Exception e) {
            log.error("Failed to cache price in Redis: {}", e.getMessage());
        }

        snapshotRepository.save(PriceSnapshot.builder()
                .price(dto.getPrice())
                .marketCap(dto.getMarketCap())
                .volume24h(dto.getVolume24h())
                .change24h(dto.getChange24h())
                .recordedAt(dto.getTimestamp())
                .build());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_PRICE_UPDATED,
                dto);
        log.info("Price published to RabbitMQ: ${}", dto.getPrice());
    }

    public BitcoinPriceDTO getCurrentPrice() {
        try {
            String json = redisTemplate.opsForValue().get(CACHE_KEY);
            if (json != null) {
                log.debug("Cache hit for current price");
                return objectMapper.readValue(json, BitcoinPriceDTO.class);
            }
        } catch (Exception e) {
            log.error("Failed to read price from Redis: {}", e.getMessage());
        }
        log.warn("Cache miss for current price");
        return null;
    }

    public List<PriceSnapshot> getHistory(int days) {
        Instant from = Instant.now().minus(days, ChronoUnit.DAYS);
        return snapshotRepository.findHistory(from);
    }
}