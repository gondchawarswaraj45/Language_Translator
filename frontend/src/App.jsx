import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Languages, 
  Volume2, 
  Mic, 
  Copy, 
  History, 
  ArrowRightLeft, 
  Trash2,
  RefreshCw,
  Sparkles,
  Palette,
  Check,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Bengali', code: 'bn' },
  { name: 'Marathi', code: 'mr' },
  { name: 'Telugu', code: 'te' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Gujarati', code: 'gu' },
  { name: 'Kannada', code: 'kn' },
  { name: 'Malayalam', code: 'ml' },
  { name: 'Punjabi', code: 'pa' },
  { name: 'Assamese', code: 'as' },
  { name: 'Sanskrit', code: 'sa' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Chinese', code: 'zh' },
  { name: 'French', code: 'fr' },
  { name: 'Spanish', code: 'es' },
  { name: 'German', code: 'de' },
  { name: 'Russian', code: 'ru' }
];

const THEMES = [
  { id: 'midnight', name: 'Midnight', color: '#6366f1' },
  { id: 'oceanic', name: 'Oceanic', color: '#0d9488' },
  { id: 'sunset', name: 'Sunset', color: '#ef4444' },
  { id: 'forest', name: 'Forest', color: '#10b981' },
  { id: 'minimal', name: 'Minimal', color: '#0f172a' }
];

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState('midnight');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        text: inputText,
        source: sourceLang,
        target: targetLang
      });
      setTranslatedText(response.data.translatedText);
      fetchHistory();
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleSpeechOutput = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => setInputText(event.results[0][0].transcript);
    recognition.start();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Top Bar with Themes */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', color: 'white' }}>
            <Languages size={28} />
          </div>
          <h1>Language Translator</h1>
        </motion.div>

        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                width: '32px', height: '32px', borderRadius: '10px', padding: 0, background: t.color, border: theme === t.id ? '2px solid white' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title={t.name}
            >
              {theme === t.id && <Check size={16} color="white" />}
            </button>
          ))}
        </div>
      </nav>

      <main>
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass" 
          style={{ padding: '40px', borderRadius: '32px' }}
        >
          {/* Controls */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'center' }}>
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} style={{ flex: 1 }}>
              {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>

            <motion.button 
              whileHover={{ rotate: 180 }}
              onClick={handleSwap} 
              className="minimal"
              style={{ width: '50px', height: '50px', padding: 0, borderRadius: '50%' }}
            >
              <ArrowRightLeft size={20} />
            </motion.button>

            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} style={{ flex: 1 }}>
              {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
          </div>

          {/* Text Areas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ position: 'relative' }}>
              <textarea
                placeholder="Type here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ width: '100%', minHeight: '260px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
              />
              <div style={{ 
                display: 'flex', gap: '12px', padding: '12px 16px', background: 'var(--bg-card)', 
                border: '1.5px solid var(--border)', borderTop: 'none', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' 
              }}>
                <button onClick={handleSpeechInput} className={`minimal ${isListening ? 'listening' : ''}`} style={{ padding: '8px' }}>
                  <Mic size={18} color={isListening ? '#ef4444' : 'var(--text-muted)'} />
                </button>
                <button onClick={() => handleSpeechOutput(inputText, sourceLang)} className="minimal" style={{ padding: '8px' }}>
                  <Volume2 size={18} color="var(--text-muted)" />
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <textarea
                readOnly
                placeholder="Translation..."
                value={translatedText}
                style={{ width: '100%', minHeight: '260px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, background: 'rgba(0,0,0,0.1)' }}
              />
              <div style={{ 
                display: 'flex', gap: '12px', padding: '12px 16px', background: 'var(--bg-card)', 
                border: '1.5px solid var(--border)', borderTop: 'none', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' 
              }}>
                <button onClick={() => copyToClipboard(translatedText)} className="minimal" style={{ padding: '8px' }}>
                  <Copy size={18} color="var(--text-muted)" />
                </button>
                <button onClick={() => handleSpeechOutput(translatedText, targetLang)} className="minimal" style={{ padding: '8px' }}>
                  <Volume2 size={18} color="var(--text-muted)" />
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleTranslate} 
              disabled={isLoading || !inputText}
              style={{ minWidth: '240px', height: '56px', fontSize: '1.1rem' }}
            >
              {isLoading ? <RefreshCw className="spin" size={22} /> : <><Zap size={18} /> Translate</>}
            </button>
          </div>
        </motion.div>

        {/* History Section */}
        <section style={{ marginTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <History size={24} color="var(--primary)" /> Recent Activity
            </h2>
            <button onClick={() => setShowHistory(!showHistory)} className="minimal" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {history.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No history found. Start translating!</div>
                  ) : (
                    history.slice(0, 6).map((item, index) => (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        key={item.id} 
                        className="glass" 
                        style={{ padding: '20px', borderRadius: '20px', fontSize: '0.95rem' }}
                      >
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {item.sourceLang} → {item.targetLang}
                        </div>
                        <div style={{ marginBottom: '8px', fontWeight: '500' }}>{item.originalText}</div>
                        <div style={{ color: 'var(--primary)', fontWeight: '600' }}>{item.translatedText}</div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>© 2026 Language Translator • Powered by Intelligence</p>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .listening { animation: pulse 1.5s infinite; background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; }
        @keyframes pulse { 
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}

export default App;
