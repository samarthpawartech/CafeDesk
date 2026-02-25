package com.cafedesk.backend.admin.service;

import com.cafedesk.backend.admin.DTO.MenuRequest;
import com.cafedesk.backend.admin.DTO.MenuResponse;
import com.cafedesk.backend.admin.entity.Menu;
import com.cafedesk.backend.admin.exception.ResourceNotFoundException;
import com.cafedesk.backend.admin.repository.MenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuRepository repository;

    // ✅ Image upload folder (Frontend public folder)
    private final String uploadDir = "D:/CafeDesk/frontend_CafeDesk/public/menu/";

    public MenuService(MenuRepository repository) {
        this.repository = repository;
    }

    // ================= SAVE MENU =================
    public MenuResponse saveMenu(MenuRequest dto, MultipartFile image) {

        String imagePath = null;

        if (image != null && !image.isEmpty()) {
            imagePath = saveImage(image);
        }

        Menu menu = new Menu(
                dto.getName(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getCategory(),
                dto.getAvailability(),
                imagePath,
                null
        );

        Menu savedMenu = repository.save(menu);
        return mapToDTO(savedMenu);
    }

    // ================= GET ALL =================
    public List<MenuResponse> getAllMenus() {
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    public MenuResponse getMenuById(Long id) {
        Menu menu = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));

        return mapToDTO(menu);
    }

    // ================= UPDATE =================
    public MenuResponse updateMenu(Long id, MenuRequest dto, MultipartFile image) {

        Menu menu = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));

        menu.setName(dto.getName());
        menu.setDescription(dto.getDescription());
        menu.setPrice(dto.getPrice());
        menu.setCategory(dto.getCategory());
        menu.setAvailability(dto.getAvailability());

        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            menu.setImagePath(imagePath);
        }

        Menu updatedMenu = repository.save(menu);
        return mapToDTO(updatedMenu);
    }

    // ================= DELETE =================
    public void deleteMenu(Long id) {

        Menu menu = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));

        repository.delete(menu);
    }

    // ================= IMAGE SAVE METHOD =================
    private String saveImage(MultipartFile file) {

        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalFileName = Objects.requireNonNull(file.getOriginalFilename());
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

            String fileName = UUID.randomUUID() + extension;

            Path path = Paths.get(uploadDir + fileName);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // This path will be stored in DB
            return "/menu/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store image file", e);
        }
    }

    // ================= ENTITY → DTO =================
    private MenuResponse mapToDTO(Menu menu) {
        return new MenuResponse(
                menu.getId(),
                menu.getName(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getCategory(),
                menu.getAvailability(),
                menu.getImagePath(),
                menu.getCreatedAt()
        );
    }
}