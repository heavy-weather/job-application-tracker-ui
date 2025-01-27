package com.anthonyguidotti.job_application_tracker.application;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.function.ServerRequest;

@Controller
public class ApplicationController {
    private final String jobApplicationTrackerApiUrl;

    public ApplicationController(
            @Value("${jobApplicationTracker.api.url}") String jobApplicationTrackerApiUrl
    ) {
        this.jobApplicationTrackerApiUrl = jobApplicationTrackerApiUrl;
    }

    @GetMapping({"/", "/job-applications/**"})
    public String home(
            HttpServletResponse response,
            Model model
    ) {
        model.addAttribute("jobApplicationTrackerApiUrl", jobApplicationTrackerApiUrl);
        return "home";
    }
}
