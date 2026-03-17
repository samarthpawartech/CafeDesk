package com.cafedesk.backend.Bills.Service;

import com.cafedesk.backend.Bills.DTO.*;
import com.cafedesk.backend.Bills.entity.Bill;
import com.cafedesk.backend.Bills.entity.BillItem;
import com.cafedesk.backend.Bills.Repository.BillRepository;
import org.springframework.stereotype.Service;

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
    public BillResponseDTO approveBill(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        bill.setStatus("APPROVED");

        return mapToDTO(billRepository.save(bill));
    }

    // ================= CREATE BILL =================
    public BillResponseDTO createBill(BillRequestDTO request) {

        Bill bill = new Bill();
        bill.setCustomerName(request.getCustomerName());
        bill.setTableNumber(request.getTableNumber());

        List<BillItem> items = request.getItems().stream().map(i -> {
            BillItem item = new BillItem();
            item.setName(i.getName());
            item.setPrice(i.getPrice());
            item.setQuantity(i.getQuantity());
            item.setBill(bill);
            return item;
        }).collect(Collectors.toList());

        bill.setItems(items);

        // ✅ calculate total
        double total = items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        bill.setAmount(total);

        return mapToDTO(billRepository.save(bill));
    }

    // ================= MAPPER =================
    private BillResponseDTO mapToDTO(Bill bill) {

        BillResponseDTO dto = new BillResponseDTO();

        dto.setId(bill.getId());
        dto.setInvoiceNumber(bill.getInvoiceNumber());
        dto.setCustomerName(bill.getCustomerName());
        dto.setTableNumber(bill.getTableNumber());
        dto.setAmount(bill.getAmount());
        dto.setStatus(bill.getStatus());
        dto.setDate(bill.getDate());

        List<BillitemDTO> items = bill.getItems().stream().map(i -> {
            BillitemDTO item = new BillitemDTO();
            item.setName(i.getName());
            item.setPrice(i.getPrice());
            item.setQuantity(i.getQuantity());
            return item;
        }).collect(Collectors.toList());

        dto.setItems(items);

        return dto;
    }
}