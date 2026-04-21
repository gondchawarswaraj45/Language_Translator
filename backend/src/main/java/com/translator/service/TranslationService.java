package com.translator.service;

import com.translator.model.TranslationHistory;
import com.translator.model.TranslationRequest;
import com.translator.model.TranslationResponse;
import com.translator.repository.TranslationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
public class TranslationService {

    @Autowired
    private TranslationHistoryRepository repository;

    private final RestTemplate restTemplate = new RestTemplate();

    public TranslationResponse translate(TranslationRequest request) {
        String url = "https://api.mymemory.translated.net/get?q={q}&langpair={langpair}";
        String langPair = request.getSource() + "|" + request.getTarget();
        
        System.out.println("Processing translation: " + request.getText() + " [" + langPair + "]");

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class, request.getText(), langPair);
            Map<String, Object> responseData = (Map<String, Object>) response.get("responseData");
            String translatedText = responseData.get("translatedText").toString();
            
            System.out.println("Received translation: " + translatedText);

            // Save to history
            TranslationHistory history = new TranslationHistory();
            history.setOriginalText(request.getText());
            history.setTranslatedText(translatedText);
            history.setSourceLang(request.getSource());
            history.setTargetLang(request.getTarget());
            repository.save(history);

            return TranslationResponse.builder()
                    .translatedText(translatedText)
                    .sourceLanguage(request.getSource())
                    .targetLanguage(request.getTarget())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Translation failed: " + e.getMessage());
        }
    }

    public List<TranslationHistory> getHistory() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}
