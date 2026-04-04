package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.Bills.entity.Bill;
import com.cafedesk.backend.Bills.Repository.BillRepository;
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

        // ✅ Fetch Bill
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));

        // ✅ Generate PDF
        byte[] pdfBytes = invoicePdfService.generateInvoice(bill);

        // ✅ Safe filename handling
        String fileName = (bill.getInvoiceNumber() != null && !bill.getInvoiceNumber().isEmpty())
                ? bill.getInvoiceNumber()
                : "invoice_" + bill.getId();

        // ✅ Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(fileName + ".pdf")
                        .build()
        );

        // ✅ Return Response
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdfBytes);
    }
}