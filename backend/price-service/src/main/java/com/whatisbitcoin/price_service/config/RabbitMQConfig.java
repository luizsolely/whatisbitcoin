package com.whatisbitcoin.price_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // ── Exchange ────────────────────────────────────
    public static final String EXCHANGE = "bitcoin.exchange";

    // ── Routing keys ───────────────────────────────
    public static final String ROUTING_PRICE_UPDATED  = "price.updated";
    public static final String ROUTING_ALERT_TRIGGERED = "price.alert.triggered";

    // ── Queues ──────────────────────────────────────
    public static final String QUEUE_PRICE_UPDATED   = "queue.price.updated";
    public static final String QUEUE_ALERT_TRIGGERED = "queue.alert.triggered";

    @Bean
    TopicExchange bitcoinExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    @Bean
    Queue priceUpdatedQueue() {
        return QueueBuilder.durable(QUEUE_PRICE_UPDATED).build();
    }

    @Bean
    Queue alertTriggeredQueue() {
        return QueueBuilder.durable(QUEUE_ALERT_TRIGGERED).build();
    }

    @Bean
    Binding priceUpdatedBinding(Queue priceUpdatedQueue, TopicExchange bitcoinExchange) {
        return BindingBuilder
                .bind(priceUpdatedQueue)
                .to(bitcoinExchange)
                .with(ROUTING_PRICE_UPDATED);
    }

    @Bean
    Binding alertTriggeredBinding(Queue alertTriggeredQueue, TopicExchange bitcoinExchange) {
        return BindingBuilder
                .bind(alertTriggeredQueue)
                .to(bitcoinExchange)
                .with(ROUTING_ALERT_TRIGGERED);
    }

    // ── JSON converter ──────────────────────────────
    @Bean
    Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
