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
    @GetMapping("/user/{username}")
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

        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        for (var item : request.getItems()) {
            if (item.getPrice() == null || item.getQuantity() == null) {
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.ok(billService.createBill(request));
    }
}