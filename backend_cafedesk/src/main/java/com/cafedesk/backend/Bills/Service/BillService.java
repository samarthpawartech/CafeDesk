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
        return billRepository.findAllWithItems()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= CUSTOMER BILLS =================
    public List<BillResponseDTO> getCustomerBills(String name) {
        return billRepository.findByCustomerNameWithItems(name)
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

        return mapToDTO(bill);
    }

    // ================= CREATE BILL =================
    @Transactional
    public BillResponseDTO createBill(BillRequestDTO request) {

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create bill: No items found");
        }

        Bill bill = new Bill();
        bill.setCustomerName(request.getCustomerName());
        bill.setTableNumber(request.getTableNumber());
        bill.setStatus("PENDING");

        // 🔥 Invoice generation (INV-0001)
        Long count = billRepository.countBy();
        String invoiceNumber = String.format("INV-%04d", count + 1);
        bill.setInvoiceNumber(invoiceNumber);

        List<BillItem> itemList = new ArrayList<>();

        for (BillitemDTO dto : request.getItems()) {
            BillItem item = new BillItem();
            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());
            item.setBill(bill);
            itemList.add(item);
        }

        bill.setItems(itemList);

        double total = itemList.stream()
                .mapToDouble(i ->
                        (i.getPrice() != null ? i.getPrice() : 0.0) *
                                (i.getQuantity() != null ? i.getQuantity() : 0)
                )
                .sum();

        bill.setTotalAmount(total);

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

        return mapToDTO(bill);
    }

    // ================= DTO MAPPER =================
    private BillResponseDTO mapToDTO(Bill bill) {

        BillResponseDTO dto = new BillResponseDTO();

        dto.setId(bill.getId());
        dto.setInvoiceNumber(bill.getInvoiceNumber());
        dto.setCustomerName(bill.getCustomerName());
        dto.setTableNumber(bill.getTableNumber());

        dto.setAmount(bill.getTotalAmount());
        dto.setTotalAmount(bill.getTotalAmount());

        dto.setOrderId(bill.getOrder() != null ? bill.getOrder().getId() : null);

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