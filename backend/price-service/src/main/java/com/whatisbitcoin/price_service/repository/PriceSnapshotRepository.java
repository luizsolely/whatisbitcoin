package com.whatisbitcoin.price_service.repository;

import com.whatisbitcoin.price_service.model.PriceSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface PriceSnapshotRepository extends JpaRepository<PriceSnapshot, Long> {

    List<PriceSnapshot> findByRecordedAtAfterOrderByRecordedAtAsc(Instant from);

    @Query("""
        SELECT p FROM PriceSnapshot p
        WHERE p.recordedAt >= :from
        ORDER BY p.recordedAt ASC
    """)
    List<PriceSnapshot> findHistory(@Param("from") Instant from);
}
