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
        List<Bill> bills = billRepository.findAll();

        return bills.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= CUSTOMER BILLS =================
    public List<BillResponseDTO> getCustomerBills(String name) {

        List<Bill> bills = billRepository.findByCustomerName(name);

        return bills.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= APPROVE BILL =================
    @Transactional
    public BillResponseDTO approveBill(Long id) {

        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found ❌"));

        bill.setStatus("APPROVED");

        Bill updated = billRepository.save(bill);

        return mapToDTO(updated);
    }

    // ================= CREATE BILL =================
    @Transactional
    public BillResponseDTO createBill(BillRequestDTO request) {

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create bill: No items ❌");
        }

        Bill bill = new Bill();
        bill.setCustomerName(request.getCustomerName());
        bill.setTableNumber(request.getTableNumber());
        bill.setStatus("PENDING");

        // ✅ UNIQUE INVOICE
        bill.setInvoiceNumber("INV-" + System.currentTimeMillis());

        List<BillItem> itemList = new ArrayList<>();

        for (BillitemDTO dto : request.getItems()) {

            if (dto.getPrice() == null || dto.getPrice() <= 0) {
                throw new RuntimeException("Invalid price ❌");
            }

            if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
                dto.setQuantity(1);
            }

            BillItem item = new BillItem();
            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());
            item.setBill(bill);

            itemList.add(item);
        }

        bill.setItems(itemList);

        double total = itemList.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        if (total <= 0) {
            throw new RuntimeException("Total cannot be zero ❌");
        }

        bill.setTotalAmount(total);

        Bill savedBill = billRepository.save(bill);

        return mapToDTO(savedBill);
    }

    // ================= PAY BILL =================
    @Transactional
    public BillResponseDTO payBill(Long id) {

        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found ❌"));

        if (!"APPROVED".equalsIgnoreCase(bill.getStatus())) {
            throw new RuntimeException("Bill not approved ❌");
        }

        bill.setStatus("PAID");

        Bill updated = billRepository.save(bill);

        return mapToDTO(updated);
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