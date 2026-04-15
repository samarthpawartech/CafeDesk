package com.cafedesk.backend.Bills.Controller;

import com.cafedesk.backend.Bills.DTO.BillRequestDTO;
import com.cafedesk.backend.Bills.DTO.BillResponseDTO;
import com.cafedesk.backend.Bills.Service.BillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin("*")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    // ================= GET ALL BILLS =================
    @GetMapping("/all")
    public ResponseEntity<List<BillResponseDTO>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    // ================= CUSTOMER BILLS =================
    @GetMapping("/{username}")
    public ResponseEntity<List<BillResponseDTO>> getCustomerBills(
            @PathVariable String username) {

        return ResponseEntity.ok(billService.getCustomerBills(username));
    }

    // ================= APPROVE BILL =================
    @PutMapping("/approve/{id}")
    public ResponseEntity<BillResponseDTO> approveBill(@PathVariable Long id) {
        return ResponseEntity.ok(billService.approveBill(id));
    }

    // ================= 💳 PAY BILL =================
    @PutMapping("/pay/{id}")
    public ResponseEntity<BillResponseDTO> payBill(@PathVariable Long id) {
        return ResponseEntity.ok(billService.payBill(id));
    }

    // ================= CREATE BILL =================
    @PostMapping("/place-order")
    public ResponseEntity<BillResponseDTO> createBill(
            @RequestBody BillRequestDTO request) {

        // 🔥 DEBUG LOGS (remove later if needed)
        System.out.println("===== BILL REQUEST =====");
        System.out.println("Customer: " + request.getCustomerName());
        System.out.println("Table: " + request.getTableNumber());

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Items list cannot be empty");
        }

        request.getItems().forEach(item -> {
            System.out.println("Item: " + item.getName());
            System.out.println("Price: " + item.getPrice());
            System.out.println("Qty: " + item.getQuantity());

            if (item.getPrice() == null || item.getQuantity() == null) {
                throw new RuntimeException("Price or Quantity cannot be null");
            }
        });

        return ResponseEntity.ok(billService.createBill(request));
    }
}