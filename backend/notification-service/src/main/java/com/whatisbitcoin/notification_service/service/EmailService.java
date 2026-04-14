package com.whatisbitcoin.notification_service.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
public class EmailService {

    @Value("${mail.from}")
    private String from;

    @Value("${MAIL_PASSWORD}")
    private String sendGridApiKey;

    public void sendPriceAlert(String to, BigDecimal targetPrice,
                               BigDecimal currentPrice, String direction) {
        try {
            SendGrid sg = new SendGrid(sendGridApiKey);

            Email fromEmail = new Email(from, "whatisbitcoin.com");
            Email toEmail   = new Email(to);
            String subject  = "₿ Bitcoin Price Alert — Your target was reached!";
            Content content = new Content("text/plain", buildEmailBody(targetPrice, currentPrice, direction));

            Mail mail = new Mail(fromEmail, subject, toEmail, content);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            log.info("Alert email sent to {} — status: {}", to, response.getStatusCode());

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
