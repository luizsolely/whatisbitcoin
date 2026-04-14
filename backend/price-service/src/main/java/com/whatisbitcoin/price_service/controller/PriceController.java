package com.whatisbitcoin.price_service.controller;

import com.whatisbitcoin.price_service.dto.BitcoinPriceDTO;
import com.whatisbitcoin.price_service.dto.PriceAlertRequestDTO;
import com.whatisbitcoin.price_service.model.PriceAlert;
import com.whatisbitcoin.price_service.model.PriceSnapshot;
import com.whatisbitcoin.price_service.service.AlertService;
import com.whatisbitcoin.price_service.service.PriceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/price")
@CrossOrigin(origins = {"http://localhost:4200", "https://wib-frontend-ta9i.onrender.com"})
@RequiredArgsConstructor
public class PriceController {

    private final PriceService priceService;
    private final AlertService alertService;

    // GET /api/price/current
    @GetMapping("/current")
    public ResponseEntity<BitcoinPriceDTO> getCurrentPrice() {
        BitcoinPriceDTO price = priceService.getCurrentPrice();
        if (price == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(price);
    }

    // GET /api/price/history?days=7
    @GetMapping("/history")
    public ResponseEntity<List<PriceSnapshot>> getHistory(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(priceService.getHistory(days));
    }

    // POST /api/price/alerts
    @PostMapping("/alerts")
    public ResponseEntity<PriceAlert> registerAlert(
            @Valid @RequestBody PriceAlertRequestDTO request) {
        return ResponseEntity.ok(alertService.registerAlert(request));
    }
}
