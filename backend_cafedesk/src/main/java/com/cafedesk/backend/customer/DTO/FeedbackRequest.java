package com.cafedesk.backend.customer.DTO;

public class FeedbackRequest {
    private String customerName;
    private int rating;
    private String remark;


    public String getCustomerName() { return customerName; }

    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public int getRating() { return rating; }

    public void setRating(int rating) { this.rating = rating; }

    public String getRemark() { return remark; }

    public void setRemark(String remark) { this.remark = remark; }
    
}