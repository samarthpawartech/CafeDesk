package com.cafedesk.backend.customer.controller;

import com.cafedesk.backend.customer.entity.Feedback;
import com.cafedesk.backend.customer.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerFeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // ✅ SAVE FEEDBACK
    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {

        System.out.println("Feedback Received from: " + feedback.getCustomerName());

        Feedback saved = feedbackService.saveFeedback(feedback);

        return ResponseEntity.ok(saved);
    }

    // ✅ GET ALL FEEDBACK
    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> getAllFeedback() {

        List<Feedback> feedbackList = feedbackService.getAllFeedback();

        return ResponseEntity.ok(feedbackList);
    }
}