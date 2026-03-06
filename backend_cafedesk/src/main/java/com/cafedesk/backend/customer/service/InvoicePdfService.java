package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.entity.Bill;
import com.cafedesk.backend.customer.entity.BillItem;
import com.itextpdf.barcodes.Barcode128;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoicePdfService {

    public byte[] generateInvoice(Bill bill) {

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // ===== FIXED CENTER FOOTER =====
            pdfDoc.addEventHandler(PdfDocumentEvent.END_PAGE, new FooterHandler());

            // ===============================
            // ===== RESTAURANT HEADER =====
            // ===============================

            document.add(new Paragraph("CafeDesk")
                    .setFontSize(26)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("Premium Coffee & Bites")
                    .setFontSize(12)
                    .setFontColor(ColorConstants.DARK_GRAY)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("GST No: 29ABCDE1234F1Z5")
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine()));
            document.add(new Paragraph(" "));

            // ===============================
            // ===== SAFE DATA =====
            // ===============================

            String invoiceNo = bill.getInvoiceNumber() != null ? bill.getInvoiceNumber() : "N/A";
            String customer = bill.getCustomerName() != null ? bill.getCustomerName() : "N/A";
            String tableNo = bill.getTableNumber() != null ? bill.getTableNumber() : "N/A";
            String status = bill.getStatus() != null ? bill.getStatus().toUpperCase() : "N/A";

            String formattedDate = "N/A";
            if (bill.getDate() != null) {
                formattedDate = bill.getDate()
                        .format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm"));
            }

            document.add(new Paragraph("Invoice No: " + invoiceNo).setBold());
            document.add(new Paragraph("Date: " + formattedDate));
            document.add(new Paragraph("Customer: " + customer));
            document.add(new Paragraph("Table: " + tableNo));
            document.add(new Paragraph("Status: " + status));

            document.add(new Paragraph(" "));

            // ===============================
            // ===== BARCODE SECTION =====
            // ===============================

            if (!invoiceNo.equals("N/A")) {
                Barcode128 barcode = new Barcode128(pdfDoc);
                barcode.setCode(invoiceNo);
                barcode.setCodeType(Barcode128.CODE128);

                Image barcodeImage = new Image(barcode.createFormXObject(pdfDoc));
                barcodeImage.setWidth(250);
                barcodeImage.setHorizontalAlignment(HorizontalAlignment.CENTER);

                document.add(barcodeImage);
                document.add(new Paragraph(" "));
            }

            // ===============================
            // ===== ITEMS TABLE =====
            // ===============================

            Table table = new Table(UnitValue.createPercentArray(new float[]{4, 2, 2, 2}))
                    .useAllAvailableWidth();

            table.addHeaderCell(new Cell().add(new Paragraph("Item"))
                    .setBackgroundColor(ColorConstants.BLACK)
                    .setFontColor(ColorConstants.WHITE));

            table.addHeaderCell(new Cell().add(new Paragraph("Qty"))
                    .setBackgroundColor(ColorConstants.BLACK)
                    .setFontColor(ColorConstants.WHITE));

            table.addHeaderCell(new Cell().add(new Paragraph("Price"))
                    .setBackgroundColor(ColorConstants.BLACK)
                    .setFontColor(ColorConstants.WHITE));

            table.addHeaderCell(new Cell().add(new Paragraph("Total"))
                    .setBackgroundColor(ColorConstants.BLACK)
                    .setFontColor(ColorConstants.WHITE));

            if (bill.getItems() != null && !bill.getItems().isEmpty()) {

                for (BillItem item : bill.getItems()) {

                    String name = item.getName() != null ? item.getName() : "N/A";
                    int qty = item.getQuantity();
                    double price = item.getPrice();
                    double total = price * qty;

                    table.addCell(name);
                    table.addCell(String.valueOf(qty));
                    table.addCell("₹" + price);
                    table.addCell("₹" + total);
                }
            }

            document.add(table);
            document.add(new Paragraph(" "));

            // ===============================
            // ===== GRAND TOTAL =====
            // ===============================

            double amount = bill.getAmount() != null ? bill.getAmount() : 0.0;

            document.add(new Paragraph("Grand Total: ₹" + amount)
                    .setBold()
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.RIGHT));

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }

    // ===============================
    // ===== CENTER FOOTER =====
    // ===============================

    private static class FooterHandler implements IEventHandler {

        @Override
        public void handleEvent(Event event) {

            PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
            PdfPage page = docEvent.getPage();
            Rectangle pageSize = page.getPageSize();

            PdfCanvas pdfCanvas = new PdfCanvas(page);
            Canvas canvas = new Canvas(pdfCanvas, pageSize);

            canvas.showTextAligned(
                    new Paragraph("Thank you for visiting CafeDesk ☕")
                            .setFontSize(12)
                            .setFontColor(ColorConstants.DARK_GRAY),
                    pageSize.getWidth() / 2,
                    20,
                    TextAlignment.CENTER
            );
            canvas.showTextAligned(
                    new Paragraph("Developed by https://github.com/samarthpawartech with ❤️")
                            .setFontSize(12)
                            .setFontColor(ColorConstants.DARK_GRAY),
                    pageSize.getWidth() / 2,
                    20,
                    TextAlignment.CENTER
            );
            canvas.close();
        }
    }
}