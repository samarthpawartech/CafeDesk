"use client";

import React from "react";

const CafeDeskInvoice = ({
  invoiceNumber = "INV-1001",
  createdDate = new Date().toLocaleDateString(),
  dueDate = new Date().toLocaleDateString(),
  cafe = {
    name: "CafeDesk",
    address1: "FC Road, Pune",
    address2: "Maharashtra, India",
    tax: "GSTIN: 27ABCDE1234F1Z5",
  },
  customer = {
    name: "Customer Name",
    table: "T01",
  },
  items = [],
  currency = "₹",
  taxRate = 5,
  footerText = "Thank you for dining with CafeDesk.",
  footerText2 = "We hope to serve you again!",
}) => {
  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = ((subTotal * taxRate) / 100).toFixed(2);
  const total = (subTotal + Number(taxAmount)).toFixed(2);

  return (
    <div style={styles.body}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.invoiceTitle}>INVOICE</div>
        <div style={styles.companyInfo}>
          <div>
            <strong>Invoice #:</strong> {invoiceNumber}
          </div>
          <div>
            <strong>Date:</strong> {createdDate}
          </div>
          <div>
            <strong>Due:</strong> {dueDate}
          </div>
        </div>
      </div>

      {/* PARTIES */}
      <div style={styles.parties}>
        <div style={styles.party}>
          <h3 style={styles.partyTitle}>From</h3>
          <strong>{cafe.name}</strong>
          <br />
          {cafe.address1}
          <br />
          {cafe.address2}
          <br />
          {cafe.tax}
        </div>

        <div style={styles.party}>
          <h3 style={styles.partyTitle}>To</h3>
          <strong>{customer.name}</strong>
          <br />
          Table No: {customer.table}
        </div>
      </div>

      {/* ITEMS */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Item</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Qty</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={styles.td}>{item.name}</td>
              <td style={{ ...styles.td, textAlign: "right" }}>
                {item.quantity}
              </td>
              <td style={{ ...styles.td, textAlign: "right" }}>
                {currency} {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <table style={styles.totals}>
        <tbody>
          <tr>
            <td>Subtotal:</td>
            <td style={{ textAlign: "right" }}>
              {currency} {subTotal.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>Tax ({taxRate}%):</td>
            <td style={{ textAlign: "right" }}>
              {currency} {taxAmount}
            </td>
          </tr>
          <tr style={styles.totalRow}>
            <td>Total:</td>
            <td style={{ textAlign: "right" }}>
              {currency} {total}
            </td>
          </tr>
        </tbody>
      </table>

      {/* NOTES */}
      <div style={styles.notes}>
        <strong>Notes:</strong>
        <br />
        {footerText}
        <br />
        {footerText2}
      </div>
    </div>
  );
};

export default CafeDeskInvoice;

/* ================= STYLES ================= */

const styles = {
  body: {
    fontFamily: "Helvetica, Arial, sans-serif",
    margin: "40px",
    color: "#333",
    background: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "40px",
    borderBottom: "2px solid #000",
    paddingBottom: "20px",
  },
  invoiceTitle: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  companyInfo: {
    textAlign: "right",
  },
  parties: {
    display: "flex",
    justifyContent: "space-between",
    margin: "40px 0",
  },
  party: {
    width: "45%",
  },
  partyTitle: {
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#666",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "30px 0",
  },
  th: {
    background: "#f5f5f5",
    padding: "12px",
    textAlign: "left",
    fontSize: "12px",
    textTransform: "uppercase",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  totals: {
    width: "300px",
    marginLeft: "auto",
    marginTop: "20px",
  },
  totalRow: {
    fontWeight: "bold",
    fontSize: "18px",
    borderTop: "2px solid #000",
  },
  notes: {
    marginTop: "40px",
    padding: "20px",
    background: "#f9f9f9",
    borderLeft: "4px solid #000",
  },
};
