package com.cafedesk.backend.employee.Service;

import com.cafedesk.backend.employee.DTO.LoginRequest;
import com.cafedesk.backend.employee.DTO.LoginResponse;
import com.cafedesk.backend.employee.entity.Staff;
import com.cafedesk.backend.employee.Repository.StaffRepository;
import com.cafedesk.backend.Security.jwt.JwtUtil;   // ✅ Correct import
import org.springframework.stereotype.Service;

@Service
public class EmployeeAuthService {

    private final StaffRepository staffRepository;
    private final JwtUtil jwtUtil;

    public EmployeeAuthService(StaffRepository staffRepository, JwtUtil jwtUtil) {
        this.staffRepository = staffRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

        Staff staff = staffRepository
                .findByMobileNumberAndEmail(
                        request.getUsername(),
                        request.getPassword()
                )
                .orElseThrow(() ->
                        new RuntimeException("Invalid mobile number or email"));

        // ✅ Role is already String
        String token = jwtUtil.generateToken(
                staff.getMobileNumber(),
                staff.getRole()
        );

        return new LoginResponse(
                "Login Successful",
                token,
                staff.getRole()
        );
    }
}

