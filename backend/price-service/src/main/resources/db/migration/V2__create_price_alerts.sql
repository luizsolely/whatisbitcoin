CREATE TABLE price_alerts (
    id           BIGSERIAL      PRIMARY KEY,
    email        VARCHAR(255)   NOT NULL,
    target_price NUMERIC(18, 2) NOT NULL,
    direction    VARCHAR(4)     NOT NULL CHECK (direction IN ('ABOVE', 'BELOW')),
    triggered    BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    triggered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_price_alerts_triggered ON price_alerts (triggered);
