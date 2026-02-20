package com.cafedesk.backend.employee.Controller;

import com.cafedesk.backend.employee.DTO.LoginRequest;
import com.cafedesk.backend.employee.DTO.LoginResponse;
import com.cafedesk.backend.employee.Service.EmployeeAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeAuthController {

    private final EmployeeAuthService employeeAuthService;

    public EmployeeAuthController(EmployeeAuthService employeeAuthService) {
        this.employeeAuthService = employeeAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            return ResponseEntity.ok(employeeAuthService.login(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(
                            "Invalid mobile number or email",
                            null,
                            null
                    ));
        }
    }
}
