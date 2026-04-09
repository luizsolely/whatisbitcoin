CREATE TABLE price_snapshots (
    id         BIGSERIAL    PRIMARY KEY,
    price      NUMERIC(18, 2) NOT NULL,
    market_cap NUMERIC(24, 2),
    volume_24h NUMERIC(24, 2),
    change_24h NUMERIC(8, 4),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_price_snapshots_recorded_at ON price_snapshots (recorded_at DESC);
