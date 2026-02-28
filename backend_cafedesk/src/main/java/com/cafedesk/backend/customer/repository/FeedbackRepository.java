package com.cafedesk.backend.customer.repository;

import com.cafedesk.backend.customer.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {}