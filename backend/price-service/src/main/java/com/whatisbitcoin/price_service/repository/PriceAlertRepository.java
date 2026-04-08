package com.whatisbitcoin.price_service.repository;

import com.whatisbitcoin.price_service.model.PriceAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceAlertRepository extends JpaRepository<PriceAlert, Long> {

    List<PriceAlert> findByTriggeredFalse();
}
