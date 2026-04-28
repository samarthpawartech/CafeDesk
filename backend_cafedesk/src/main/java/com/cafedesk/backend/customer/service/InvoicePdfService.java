package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.Bills.entity.Bill;
import com.cafedesk.backend.Bills.entity.BillItem;
import com.itextpdf.barcodes.Barcode128;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.*;
import com.itextpdf.layout.borders.Border;
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

            pdfDoc.addEventHandler(PdfDocumentEvent.END_PAGE, new FooterHandler());

            // ================= HEADER =================
            try {
                ImageData imageData = ImageDataFactory.create(
                        getClass().getResource("/assets/CafeDesklogo.png")
                );

                Image logo = new Image(imageData)
                        .scaleToFit(120, 120)
                        .setHorizontalAlignment(HorizontalAlignment.CENTER);

                document.add(logo);

            } catch (Exception e) {
                document.add(new Paragraph("CafeDesk")
                        .setFontSize(26)
                        .setBold()
                        .setTextAlignment(TextAlignment.CENTER));
            }

            document.add(new Paragraph("Premium Coffee & Bites")
                    .setFontSize(12)
                    .setFontColor(ColorConstants.DARK_GRAY)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("GST No: 29ABCDE1234F1Z5")
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine()));
            document.add(new Paragraph("\n"));

            // ================= SAFE DATA =================

            String invoiceNo = bill.getInvoiceNumber() != null ? bill.getInvoiceNumber() : "N/A";
            String billingId = bill.getBillingId() != null ? bill.getBillingId() : "N/A";
            String customer = bill.getCustomerName() != null ? bill.getCustomerName() : "N/A";
            String tableNo = bill.getTableNumber() != null ? bill.getTableNumber() : "N/A";
            String status = bill.getStatus() != null ? bill.getStatus().toUpperCase() : "N/A";
            String paymentId = bill.getCfPaymentId() != null ? bill.getCfPaymentId() : "N/A";
            String orderId = bill.getCfOrderId() != null ? bill.getCfOrderId() : "N/A";

            String formattedDate = "N/A";
            if (bill.getCreatedAt() != null) {
                formattedDate = bill.getCreatedAt()
                        .format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm"));
            }

            // ================= BILL INFO TABLE (NO BORDERS + NO GREY) =================

            Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                    .setWidth(UnitValue.createPercentValue(60))
                    .setHorizontalAlignment(HorizontalAlignment.CENTER)
                    .setBorder(Border.NO_BORDER);

            infoTable.addCell(createInfoCell("Invoice No :"));
            infoTable.addCell(createInfoValue(invoiceNo));

            infoTable.addCell(createInfoCell("Billing ID :"));
            infoTable.addCell(createInfoValue(billingId));

            infoTable.addCell(createInfoCell("Date :"));
            infoTable.addCell(createInfoValue(formattedDate));

            infoTable.addCell(createInfoCell("Customer :"));
            infoTable.addCell(createInfoValue(customer));

            infoTable.addCell(createInfoCell("Table No :"));
            infoTable.addCell(createInfoValue(tableNo));

            infoTable.addCell(createInfoCell("Status :"));
            infoTable.addCell(createInfoValue(status));

            document.add(infoTable);
            document.add(new Paragraph("\n"));

            // ================= BARCODE =================

            if (!billingId.equals("N/A")) {
                Barcode128 barcode = new Barcode128(pdfDoc);
                barcode.setCode(billingId);

                Image barcodeImage = new Image(barcode.createFormXObject(pdfDoc));
                barcodeImage.setWidth(200);
                barcodeImage.setHorizontalAlignment(HorizontalAlignment.CENTER);

                document.add(barcodeImage);
                document.add(new Paragraph("\n"));
            }

            // ================= ITEMS TABLE =================

            Table table = new Table(UnitValue.createPercentArray(new float[]{4, 2, 2, 2}))
                    .useAllAvailableWidth();

            table.addHeaderCell(createHeaderCell("Item"));
            table.addHeaderCell(createHeaderCell("Qty"));
            table.addHeaderCell(createHeaderCell("Price"));
            table.addHeaderCell(createHeaderCell("Total"));

            if (bill.getItems() != null && !bill.getItems().isEmpty()) {

                for (BillItem item : bill.getItems()) {

                    String name = item.getName() != null ? item.getName() : "N/A";
                    int qty = item.getQuantity() != null ? item.getQuantity() : 0;
                    double price = item.getPrice() != null ? item.getPrice() : 0.0;
                    double total = price * qty;

                    table.addCell(new Cell().add(new Paragraph(name)));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(qty)))
                            .setTextAlignment(TextAlignment.CENTER));
                    table.addCell(new Cell().add(new Paragraph(formatCurrency(price)))
                            .setTextAlignment(TextAlignment.RIGHT));
                    table.addCell(new Cell().add(new Paragraph(formatCurrency(total)))
                            .setTextAlignment(TextAlignment.RIGHT));
                }
            }

            document.add(table);
            document.add(new Paragraph("\n"));

            // ================= TOTAL =================

            double amount = bill.getTotalAmount() != null ? bill.getTotalAmount() : 0.0;

            document.add(new Paragraph("Grand Total: " + formatCurrency(amount))
                    .setBold()
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.RIGHT));

            document.add(new Paragraph("\n"));

            // ================= PAYMENT DETAILS =================

            document.add(new Paragraph("Payment Details")
                    .setBold()
                    .setFontSize(14));

            document.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine()));

            document.add(new Paragraph("Payment ID : " + paymentId));
            document.add(new Paragraph("Order ID   : " + orderId));

            document.add(new Paragraph("\n\n"));

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }

    // ================= HEADER CELL =================
    private Cell createHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text))
                .setBackgroundColor(ColorConstants.BLACK)
                .setFontColor(ColorConstants.WHITE)
                .setTextAlignment(TextAlignment.CENTER);
    }

    // ✅ FIXED HERE (NO GREY)
    private Cell createInfoCell(String text) {
        return new Cell()
                .add(new Paragraph(text))
                .setBold()
                .setBorder(Border.NO_BORDER);
    }

    private Cell createInfoValue(String text) {
        return new Cell()
                .add(new Paragraph(text))
                .setBorder(Border.NO_BORDER);
    }

    private String formatCurrency(double value) {
        return String.format("₹%.2f", value);
    }

    // ================= FOOTER =================
    private static class FooterHandler implements IEventHandler {

        @Override
        public void handleEvent(Event event) {

            PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
            PdfPage page = docEvent.getPage();
            Rectangle pageSize = page.getPageSize();

            PdfCanvas pdfCanvas = new PdfCanvas(
                    page.newContentStreamAfter(),
                    page.getResources(),
                    docEvent.getDocument()
            );

            Canvas canvas = new Canvas(pdfCanvas, pageSize);

            canvas.showTextAligned(
                    new Paragraph("Thank you for visiting CafeDesk ☕")
                            .setFontSize(12)
                            .setFontColor(ColorConstants.DARK_GRAY),
                    pageSize.getWidth() / 2,
                    30,
                    TextAlignment.CENTER
            );

            canvas.showTextAligned(
                    new Paragraph("Developed by SAMARTH PAWAR WITH Love")
                            .setFontSize(10)
                            .setFontColor(ColorConstants.GRAY),
                    pageSize.getWidth() / 2,
                    15,
                    TextAlignment.CENTER
            );

            canvas.close();
        }
    }
}