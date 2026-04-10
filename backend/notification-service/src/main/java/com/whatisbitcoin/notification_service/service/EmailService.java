package com.whatisbitcoin.notification_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPriceAlert(String to, BigDecimal targetPrice,
                               BigDecimal currentPrice, String direction) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("₿ Bitcoin Price Alert — Your target was reached!");
            message.setText(buildEmailBody(targetPrice, currentPrice, direction));

            mailSender.send(message);
            log.info("Alert email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send alert email to {}: {}", to, e.getMessage());
        }
    }

    private String buildEmailBody(BigDecimal targetPrice,
                                  BigDecimal currentPrice, String direction) {
        String condition = direction.equals("ABOVE") ? "risen above" : "fallen below";
        return """
                Your Bitcoin price alert has been triggered!
                
                Target:  $%s (%s)
                Current: $%s
                
                This alert has been marked as complete and will not trigger again.
                
                — whatisbitcoin.com
                """.formatted(targetPrice, condition, currentPrice);
    }
}
