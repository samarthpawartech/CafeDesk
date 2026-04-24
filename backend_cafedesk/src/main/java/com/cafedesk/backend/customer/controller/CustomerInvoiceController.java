package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.Bills.entity.Bill;
import com.cafedesk.backend.Bills.Repository.BillRepository;
import com.cafedesk.backend.customer.service.InvoicePdfService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
    public ResponseEntity<?> downloadInvoice(@PathVariable Long id) {

        try {
            // ✅ Fetch Bill safely
            Optional<Bill> optionalBill = billRepository.findById(id);

            if (optionalBill.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body("❌ Bill not found with id: " + id);
            }

            Bill bill = optionalBill.get();

            // ✅ Generate PDF
            byte[] pdfBytes = invoicePdfService.generateInvoice(bill);

            // ✅ Better filename (Billing ID > Invoice No > fallback)
            String fileName;

            if (bill.getBillingId() != null && !bill.getBillingId().isEmpty()) {
                fileName = bill.getBillingId();
            } else if (bill.getInvoiceNumber() != null && !bill.getInvoiceNumber().isEmpty()) {
                fileName = bill.getInvoiceNumber();
            } else {
                fileName = "invoice_" + bill.getId();
            }

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

        } catch (Exception e) {

            // ✅ Proper error response
            return ResponseEntity
                    .status(500)
                    .body("❌ Error generating invoice: " + e.getMessage());
        }
    }
}