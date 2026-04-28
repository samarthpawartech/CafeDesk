package com.cafedesk.backend.Security.config;

import com.cafedesk.backend.employee.entity.TableEntity;
import com.cafedesk.backend.employee.entity.TableStatus;
import com.cafedesk.backend.employee.Repository.TableRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadTables(TableRepository repo) {
        return args -> {

            // ✅ Get all existing table codes in ONE query
            Set<String> existingCodes = repo.findAll()
                    .stream()
                    .map(TableEntity::getTableCode)
                    .collect(Collectors.toSet());

            // ✅ Insert only missing ones
            saveIfMissing(repo, existingCodes, "T01", 2, TableStatus.OCCUPIED);
            saveIfMissing(repo, existingCodes, "T02", 4, TableStatus.AVAILABLE);
            saveIfMissing(repo, existingCodes, "T03", 4, TableStatus.AVAILABLE);
            saveIfMissing(repo, existingCodes, "T04", 2, TableStatus.AVAILABLE);
            saveIfMissing(repo, existingCodes, "T05", 6, TableStatus.AVAILABLE);
            saveIfMissing(repo, existingCodes, "T06", 2, TableStatus.AVAILABLE);
            saveIfMissing(repo, existingCodes, "T07", 4, TableStatus.AVAILABLE);
            saveIfMissing(repo, existingCodes, "T08", 4, TableStatus.RESERVED);
        };
    }

    private void saveIfMissing(TableRepository repo, Set<String> existingCodes,
                               String code, int capacity, TableStatus status) {

        if (!existingCodes.contains(code)) {
            repo.save(new TableEntity(code, capacity, status));
        }
    }
}