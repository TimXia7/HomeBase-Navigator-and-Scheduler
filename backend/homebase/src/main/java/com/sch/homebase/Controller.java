package com.sch.homebase;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

    @GetMapping("/")
    public String home() {
        return "Backend is working!";
    }

    @GetMapping("/test1")
        public String home() {
            return "/test1 has beel called";
        }
    }

    @GetMapping("/test2")
        public String home() {
            return "/test2 has beel called";
        }
    }
}