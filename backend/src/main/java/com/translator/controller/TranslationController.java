package com.translator.controller;

import com.translator.model.TranslationHistory;
import com.translator.model.TranslationRequest;
import com.translator.model.TranslationResponse;
import com.translator.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For development
public class TranslationController {

    @Autowired
    private TranslationService translationService;

    @PostMapping("/translate")
    public ResponseEntity<TranslationResponse> translate(@RequestBody TranslationRequest request) {
        return ResponseEntity.ok(translationService.translate(request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<TranslationHistory>> getHistory() {
        return ResponseEntity.ok(translationService.getHistory());
    }
}
