package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.customer.entity.Bill;
import com.cafedesk.backend.customer.repository.BillRepository;
import com.cafedesk.backend.customer.service.InvoicePdfService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerInvoiceController {

    private final BillRepository billRepository;
    private final InvoicePdfService invoicePdfService;

    public CustomerInvoiceController(BillRepository billRepository,
                                     InvoicePdfService invoicePdfService) {
        this.billRepository = billRepository;
        this.invoicePdfService = invoicePdfService;
    }

    @GetMapping("/invoice/{id}")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {

        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        byte[] pdf = invoicePdfService.generateInvoice(bill);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(bill.getInvoiceNumber() + ".pdf")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}