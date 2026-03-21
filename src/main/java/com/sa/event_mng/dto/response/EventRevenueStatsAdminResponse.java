package com.sa.event_mng.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class EventRevenueStatsAdminResponse {
    private BigDecimal totalRevenue;
}
