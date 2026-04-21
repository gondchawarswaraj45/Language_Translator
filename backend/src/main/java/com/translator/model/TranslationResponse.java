package com.translator.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TranslationResponse {
    private String translatedText;
    private String sourceLanguage;
    private String targetLanguage;
}
