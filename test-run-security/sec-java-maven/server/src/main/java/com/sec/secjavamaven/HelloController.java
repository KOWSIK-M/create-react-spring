package com.sec.secjavamaven;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@org.springframework.web.bind.annotation.CrossOrigin(origins = "http://localhost:5173")
public class HelloController {

    @GetMapping("/")
    public String root() {
        return "Spring Boot Backend is Running! 🍃";
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Spring Boot!";
    }
}
