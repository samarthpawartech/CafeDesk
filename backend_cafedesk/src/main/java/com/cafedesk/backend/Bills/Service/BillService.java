package com.cafedesk.backend.Bills.Service;

import com.cafedesk.backend.Bills.DTO.*;
import com.cafedesk.backend.Bills.entity.Bill;
import com.cafedesk.backend.Bills.entity.BillItem;
import com.cafedesk.backend.Bills.Repository.BillRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    // ================= FETCH ALL =================
    public List<BillResponseDTO> getAllBills() {
        return billRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= CUSTOMER BILLS =================
    public List<BillResponseDTO> getCustomerBills(String name) {
        return billRepository.findByCustomerName(name)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= APPROVE BILL =================
    @Transactional
    public BillResponseDTO approveBill(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        bill.setStatus("APPROVED");

        return mapToDTO(billRepository.save(bill));
    }

    // ================= CREATE BILL =================
    @Transactional
    public BillResponseDTO createBill(BillRequestDTO request) {

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create bill: No items found");
        }

        // ✅ STEP 1: Create Bill
        Bill bill = new Bill();
        bill.setCustomerName(request.getCustomerName());
        bill.setTableNumber(request.getTableNumber());
        bill.setStatus("PENDING");

        List<BillItem> itemList = new ArrayList<>();

        // ✅ STEP 2: Convert DTO → Entity
        for (BillitemDTO dto : request.getItems()) {

            BillItem item = new BillItem();
            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());

            item.setBill(bill); // relation fix

            itemList.add(item);
        }

        // ✅ STEP 3: Attach items
        bill.setItems(itemList);

        // ✅ STEP 4: Calculate total
        double total = itemList.stream()
                .mapToDouble(i ->
                        (i.getPrice() != null ? i.getPrice() : 0.0) *
                                (i.getQuantity() != null ? i.getQuantity() : 0)
                )
                .sum();

        bill.setTotalAmount(total);

        // ❗ OPTIONAL: If you later add order linking
        // bill.setOrder(order);

        // ✅ STEP 5: Save
        Bill savedBill = billRepository.save(bill);

        return mapToDTO(savedBill);
    }

    // ================= PAY BILL =================
    @Transactional
    public BillResponseDTO payBill(Long id) {

        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (!"APPROVED".equalsIgnoreCase(bill.getStatus())) {
            throw new RuntimeException("Bill not approved yet");
        }

        bill.setStatus("PAID");

        return mapToDTO(billRepository.save(bill));
    }

    // ================= ✅ FIXED MAPPER =================
    private BillResponseDTO mapToDTO(Bill bill) {

        BillResponseDTO dto = new BillResponseDTO();

        dto.setId(bill.getId());
        dto.setInvoiceNumber(bill.getInvoiceNumber());
        dto.setCustomerName(bill.getCustomerName());
        dto.setTableNumber(bill.getTableNumber());

        // ✅ FIX 1: frontend expects amount
        dto.setAmount(bill.getTotalAmount());

        // ✅ FIX 2: keep backend consistency
        dto.setTotalAmount(bill.getTotalAmount());

        // ✅ FIX 3: orderId mapping
        if (bill.getOrder() != null) {
            dto.setOrderId(bill.getOrder().getId());
        } else {
            dto.setOrderId(null);
        }

        dto.setStatus(bill.getStatus());
        dto.setCreatedAt(bill.getCreatedAt());

        List<BillitemDTO> items = new ArrayList<>();

        if (bill.getItems() != null) {
            items = bill.getItems().stream().map(i -> {
                BillitemDTO item = new BillitemDTO();
                item.setName(i.getName());
                item.setPrice(i.getPrice());
                item.setQuantity(i.getQuantity());
                return item;
            }).collect(Collectors.toList());
        }

        dto.setItems(items);

        return dto;
    }
}