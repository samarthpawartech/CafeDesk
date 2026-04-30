package com.cafedesk.backend.employee.Controller;

import com.cafedesk.backend.customer.entity.CurrentOrder;
import com.cafedesk.backend.customer.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee/orders")
@CrossOrigin(origins = "*")
public class EmployeeTableOrderViewController {

    private final OrderService orderService;

    public EmployeeTableOrderViewController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{tableCode}")
    public ResponseEntity<List<CurrentOrder>> getOrdersByTable(
            @PathVariable String tableCode) {

        return ResponseEntity.ok(
                orderService.getOrdersByTable(tableCode)
        );
    }
}