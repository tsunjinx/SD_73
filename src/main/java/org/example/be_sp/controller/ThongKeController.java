package org.example.be_sp.controller;

import org.example.be_sp.model.response.ResponseObject;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/thong-ke")
public class ThongKeController {

    @GetMapping("/key-metrics")
    public ResponseObject<?> getKeyMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRevenue", 150000000);
        metrics.put("totalOrders", 245);
        metrics.put("totalCustomers", 89);
        metrics.put("averageOrderValue", 612000);
        
        return new ResponseObject<>(metrics, "Lay thong ke thanh cong");
    }

    @GetMapping("/time-based-stats")
    public ResponseObject<?> getTimeBasedStats() {
        Map<String, Object> stats = new HashMap<>();
        
        Map<String, Object> today = new HashMap<>();
        today.put("orders", 12);
        today.put("revenue", 7200000);
        
        Map<String, Object> week = new HashMap<>();
        week.put("orders", 89);
        week.put("revenue", 54000000);
        
        Map<String, Object> month = new HashMap<>();
        month.put("orders", 245);
        month.put("revenue", 150000000);
        
        Map<String, Object> year = new HashMap<>();
        year.put("orders", 2890);
        year.put("revenue", 1800000000);
        
        stats.put("today", today);
        stats.put("week", week);
        stats.put("month", month);
        stats.put("year", year);
        
        return new ResponseObject<>(stats, "Lay thong ke theo thoi gian thanh cong");
    }

    @GetMapping("/top-products")
    public ResponseObject<?> getTopProducts(@RequestParam(defaultValue = "5") Integer limit) {
        List<Map<String, Object>> products = Arrays.asList(
            Map.of("id", 1, "name", "Giay Nike Air Max", "sold", 45, "revenue", 18000000),
            Map.of("id", 2, "name", "Ao Adidas Original", "sold", 38, "revenue", 11400000),
            Map.of("id", 3, "name", "Quan Nike Dri-FIT", "sold", 32, "revenue", 9600000),
            Map.of("id", 4, "name", "Giay Adidas Superstar", "sold", 28, "revenue", 8400000),
            Map.of("id", 5, "name", "Ao Nike Pro", "sold", 25, "revenue", 7500000)
        );
        
        List<Map<String, Object>> result = products.subList(0, Math.min(limit, products.size()));
        return new ResponseObject<>(result, "Lay san pham ban chay thanh cong");
    }

    @GetMapping("/order-status-distribution")
    public ResponseObject<?> getOrderStatusDistribution() {
        List<Map<String, Object>> distribution = Arrays.asList(
            Map.of("status", "Da giao", "count", 156, "percentage", 63.7),
            Map.of("status", "Dang giao", "count", 45, "percentage", 18.4),
            Map.of("status", "Cho xu ly", "count", 44, "percentage", 18.0)
        );
        
        return new ResponseObject<>(distribution, "Lay phan bo trang thai don hang thanh cong");
    }

    @GetMapping("/quick-stats")
    public ResponseObject<?> getQuickStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingOrders", 44);
        stats.put("lowStockProducts", 12);
        stats.put("vipCustomers", 23);
        stats.put("todayRevenue", 7200000);
        
        return new ResponseObject<>(stats, "Lay thong ke nhanh thanh cong");
    }

    @GetMapping("/chart-data")
    public ResponseObject<?> getChartData(
            @RequestParam(defaultValue = "THANG") String period,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        
        Map<String, Object> chartData = new HashMap<>();
        chartData.put("period", period);
        chartData.put("labels", Arrays.asList("T1", "T2", "T3", "T4", "T5", "T6", "T7"));
        
        Map<String, Object> dataset = new HashMap<>();
        dataset.put("label", "Doanh thu");
        dataset.put("data", Arrays.asList(12000000, 15000000, 8000000, 18000000, 22000000, 16000000, 14000000));
        dataset.put("backgroundColor", "rgba(59, 130, 246, 0.1)");
        dataset.put("borderColor", "rgb(59, 130, 246)");
        
        chartData.put("datasets", Arrays.asList(dataset));
        
        return new ResponseObject<>(chartData, "Lay du lieu bieu do thanh cong");
    }

    @GetMapping("/revenue-by-period")
    public ResponseObject<?> getRevenueByPeriod(
            @RequestParam(defaultValue = "THANG") String period,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        
        Map<String, Object> result = new HashMap<>();
        result.put("period", period);
        
        List<Map<String, Object>> data = Arrays.asList(
            Map.of("date", "2024-01", "revenue", 45000000),
            Map.of("date", "2024-02", "revenue", 52000000),
            Map.of("date", "2024-03", "revenue", 48000000),
            Map.of("date", "2024-04", "revenue", 55000000),
            Map.of("date", "2024-05", "revenue", 62000000),
            Map.of("date", "2024-06", "revenue", 58000000)
        );
        
        result.put("data", data);
        
        return new ResponseObject<>(result, "Lay doanh thu theo ky thanh cong");
    }
}