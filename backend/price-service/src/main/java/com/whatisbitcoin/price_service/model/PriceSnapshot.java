package com.whatisbitcoin.price_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "price_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal price;

    @Column(name = "market_cap", precision = 24, scale = 2)
    private BigDecimal marketCap;

    @Column(name = "volume_24h", precision = 24, scale = 2)
    private BigDecimal volume24h;

    @Column(name = "change_24h", precision = 8, scale = 4)
    private BigDecimal change24h;

    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;

    @PrePersist
    public void prePersist() {
        if (recordedAt == null) recordedAt = Instant.now();
    }
}
