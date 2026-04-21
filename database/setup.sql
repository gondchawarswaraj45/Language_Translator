-- SQL Script for AI-Powered Multi-Language Translator System
-- Use this if you want to use MySQL instead of H2

CREATE DATABASE IF NOT EXISTS translator_db;
USE translator_db;

CREATE TABLE IF NOT EXISTS translation_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_lang VARCHAR(10) NOT NULL,
    target_lang VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
