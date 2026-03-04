package com.cafedesk.backend.customer.service;

import com.cafedesk.backend.customer.entity.Feedback;
import com.cafedesk.backend.customer.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // SAVE
    public Feedback saveFeedback(Feedback feedback) {
        feedback.setDate(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    // GET ALL
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}