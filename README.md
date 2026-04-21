# AI-Powered Multi-Language Translator System

A production-ready full-stack application that translates text between Indian and International languages using Spring Boot and React.

## 🚀 Features

- **Multi-Language Support**: Translate between English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, German, and Russian.
- **Auto History**: Automatically saves your translation history in the database.
- **Voice-to-Text**: Input text using your voice (Speech Recognition).
- **Text-to-Speech**: Listen to translations in the target language.
- **Modern UI**: Dark mode, glassmorphism design, and smooth animations.
- **Copy & Swap**: Easy clipboard copying and language swapping.

## 🛠️ Tech Stack

- **Backend**: Java 21 (Spring Boot 2.7.18)
- **Frontend**: React.js (Vite, Axios, Lucide Icons, Framer Motion)
- **Database**: H2 (In-memory, default) or MySQL
- **API**: MyMemory Translation API (Free)

## 📦 Project Structure

```
Translator/
├── backend/            # Spring Boot Application
│   ├── src/main/java/  # Java Source Code
│   └── pom.xml         # Maven Dependencies
├── frontend/           # React Frontend
│   ├── src/            # Components & Logic
│   └── package.json    # NPM Dependencies
├── database/           # SQL Setup scripts
└── README.md
```

## ⚙️ Setup Instructions

### Backend (Spring Boot)
1. Ensure You have JDK 21 installed.
2. Navigate to `backend` directory.
3. Run the application:
   ```bash
   # If you have Maven installed
   mvn spring-boot:run
   ```
4. The backend will start on `http://localhost:8080`.

### Frontend (React)
1. Ensure you have Node.js installed.
2. Navigate to `frontend` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## 📝 Usage

1. Enter text in the left textarea.
2. Select the source and target languages from the dropdowns.
3. Click **"Translate Now"**.
4. Use the **Mic** icon for voice input.
5. Use the **Speaker** icon to hear the translation.
6. Check **Recent History** to see past translations.

## 🔒 Configuration

- To use **MySQL**, update `backend/src/main/resources/application.properties` with your MySQL credentials and run the script in `database/setup.sql`.
