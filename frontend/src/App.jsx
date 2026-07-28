import React, { useState, useEffect } from 'react';
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
  Zap,
  Check,
  Star,
  Download,
  X,
  Globe,
  Share2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { name: '✨ Auto Detect', code: 'auto' },
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

const SAMPLE_PHRASES = [
  "👋 Hello! How are you doing today?",
  "📍 Could you tell me where the nearest station is?",
  "🙏 Thank you so much for your kind help!",
  "💡 What are the best places to visit around here?",
  "☕ I would like to order a warm cup of coffee."
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('translator_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'favorites'
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    localStorage.setItem('translator_favorites', JSON.stringify(favorites));
  }, [favorites]);

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
    if (sourceLang === 'auto') return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleSpeechOutput = (text, lang) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'auto' ? 'en' : lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang === 'auto' ? 'en-US' : sourceLang;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => setInputText(event.results[0][0].transcript);
    recognition.start();
  };

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'input') {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!translatedText) return;
    const element = document.createElement("a");
    const file = new Blob([`Source (${sourceLang}):\n${inputText}\n\nTranslation (${targetLang}):\n${translatedText}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `translation_${sourceLang}_to_${targetLang}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleFavorite = (item) => {
    const exists = favorites.some(f => f.originalText === item.originalText && f.translatedText === item.translatedText);
    if (exists) {
      setFavorites(favorites.filter(f => !(f.originalText === item.originalText && f.translatedText === item.translatedText)));
    } else {
      setFavorites([item, ...favorites]);
    }
  };

  const isItemFavorite = (item) => {
    return favorites.some(f => f.originalText === item.originalText && f.translatedText === item.translatedText);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="container" style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Sleek App Navigation & Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', 
            padding: '10px 14px', 
            borderRadius: '16px', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
          }}>
            <Languages size={28} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.9rem', 
              fontWeight: '800', 
              letterSpacing: '-0.5px',
              color: '#0f172a',
              margin: 0 
            }}>
              AI Translator
            </h1>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>
              Instant Multi-Language Translation Engine
            </span>
          </div>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: '#e0e7ff', 
            color: '#4338ca', 
            padding: '6px 14px', 
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            Online Engine
          </div>
        </div>
      </nav>

      {/* Main Translation Workstation Card */}
      <main>
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-card" 
          style={{ padding: '36px' }}
        >
          {/* Quick Phrases */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#6366f1" /> Sample Prompts:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SAMPLE_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(phrase.replace(/^[^\s]+\s/, ''))}
                  className="phrase-chip"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection Header */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} style={{ width: '100%' }}>
                {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
              </select>
            </div>

            <motion.button 
              whileHover={{ rotate: 180 }}
              onClick={handleSwap} 
              disabled={sourceLang === 'auto'}
              className="minimal"
              style={{ width: '48px', height: '48px', padding: 0, borderRadius: '50%', flexShrink: 0 }}
              title="Swap Languages"
            >
              <ArrowRightLeft size={18} />
            </motion.button>

            <div style={{ flex: 1, position: 'relative' }}>
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} style={{ width: '100%' }}>
                {LANGUAGES.filter(l => l.code !== 'auto').map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Two Pane Input / Output Workstation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Input Pane */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  placeholder="Type or paste your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ width: '100%', minHeight: '260px' }}
                />
                {inputText && (
                  <button 
                    onClick={() => { setInputText(''); setTranslatedText(''); }}
                    style={{ 
                      position: 'absolute', top: '14px', right: '14px', padding: '6px', 
                      borderRadius: '50%', background: '#e2e8f0', color: '#475569', boxShadow: 'none' 
                    }}
                    title="Clear text"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Input Toolbar & Info */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '10px 16px', background: '#f1f5f9', 
                border: '1.5px solid var(--border)', borderTop: 'none', 
                borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' 
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleSpeechInput} className={`minimal ${isListening ? 'listening' : ''}`} style={{ padding: '8px' }} title="Voice Input">
                    <Mic size={18} color={isListening ? '#ef4444' : '#64748b'} />
                  </button>
                  <button onClick={() => handleSpeechOutput(inputText, sourceLang)} className="minimal" style={{ padding: '8px' }} title="Listen">
                    <Volume2 size={18} color="#64748b" />
                  </button>
                  <button onClick={() => copyToClipboard(inputText, 'input')} className="minimal" style={{ padding: '8px' }} title="Copy input">
                    {copiedInput ? <Check size={18} color="#10b981" /> : <Copy size={18} color="#64748b" />}
                  </button>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
                  {charCount} chars · {wordCount} words
                </div>
              </div>
            </div>

            {/* Output Pane */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  readOnly
                  placeholder="Translation will appear here automatically..."
                  value={translatedText}
                  style={{ width: '100%', minHeight: '260px', background: '#ffffff' }}
                />
              </div>

              {/* Output Toolbar & Actions */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '10px 16px', background: '#f1f5f9', 
                border: '1.5px solid var(--border)', borderTop: 'none', 
                borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' 
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => copyToClipboard(translatedText, 'output')} className="minimal" style={{ padding: '8px' }} title="Copy translation">
                    {copiedOutput ? <Check size={18} color="#10b981" /> : <Copy size={18} color="#64748b" />}
                  </button>
                  <button onClick={() => handleSpeechOutput(translatedText, targetLang)} className="minimal" style={{ padding: '8px' }} title="Listen translation">
                    <Volume2 size={18} color="#64748b" />
                  </button>
                  <button onClick={handleDownload} disabled={!translatedText} className="minimal" style={{ padding: '8px' }} title="Download translation">
                    <Download size={18} color="#64748b" />
                  </button>
                </div>
                {translatedText && (
                  <button 
                    onClick={() => toggleFavorite({ sourceLang, targetLang, originalText: inputText, translatedText })}
                    className="minimal"
                    style={{ padding: '6px 12px', fontSize: '0.82rem', gap: '6px' }}
                  >
                    <Star size={14} fill={isItemFavorite({ originalText: inputText, translatedText }) ? '#f59e0b' : 'none'} color={isItemFavorite({ originalText: inputText, translatedText }) ? '#f59e0b' : '#64748b'} />
                    {isItemFavorite({ originalText: inputText, translatedText }) ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleTranslate} 
              disabled={isLoading || !inputText.trim()}
              style={{ minWidth: '260px', height: '54px', fontSize: '1.05rem', gap: '10px' }}
            >
              {isLoading ? <RefreshCw className="spin" size={20} /> : <><Zap size={18} /> Translate Now</>}
            </button>
          </div>
        </motion.div>

        {/* Activity & Favorites Section */}
        <section style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setActiveTab('history')}
                className={activeTab === 'history' ? '' : 'minimal'}
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
              >
                <History size={16} /> Recent Activity ({history.length})
              </button>
              <button 
                onClick={() => setActiveTab('favorites')}
                className={activeTab === 'favorites' ? '' : 'minimal'}
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
              >
                <Star size={16} /> Saved ({favorites.length})
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {activeTab === 'history' ? (
              history.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '20px', border: '1px solid var(--border)', color: '#64748b' }}>
                  No recent translations found. Type a sentence above to get started!
                </div>
              ) : (
                history.slice(0, 6).map((item, index) => (
                  <motion.div 
                    key={item.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    style={{ 
                      background: '#ffffff', 
                      padding: '20px', 
                      borderRadius: '20px', 
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        justify: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '10px' 
                      }}>
                        <span style={{ 
                          background: '#e0e7ff', 
                          color: '#4338ca', 
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem', 
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }}>
                          {item.sourceLang} → {item.targetLang}
                        </span>
                        <button 
                          onClick={() => toggleFavorite(item)}
                          className="minimal"
                          style={{ padding: '4px', border: 'none', boxShadow: 'none' }}
                        >
                          <Star size={16} fill={isItemFavorite(item) ? '#f59e0b' : 'none'} color={isItemFavorite(item) ? '#f59e0b' : '#94a3b8'} />
                        </button>
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: '500' }}>
                        {item.originalText}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: '#4f46e5', fontWeight: '600' }}>
                        {item.translatedText}
                      </p>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              favorites.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '20px', border: '1px solid var(--border)', color: '#64748b' }}>
                  No saved translations yet. Click the star icon on any translation to save it here!
                </div>
              ) : (
                favorites.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      background: '#ffffff', 
                      padding: '20px', 
                      borderRadius: '20px', 
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ 
                          background: '#fef3c7', 
                          color: '#b45309', 
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem', 
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }}>
                          ★ Saved ({item.sourceLang} → {item.targetLang})
                        </span>
                        <button 
                          onClick={() => toggleFavorite(item)}
                          className="minimal"
                          style={{ padding: '4px', border: 'none', boxShadow: 'none' }}
                        >
                          <Star size={16} fill="#f59e0b" color="#f59e0b" />
                        </button>
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: '500' }}>
                        {item.originalText}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: '#4f46e5', fontWeight: '600' }}>
                        {item.translatedText}
                      </p>
                    </div>
                  </motion.div>
                ))
              )
            )}
          </div>
        </section>
      </main>

      <footer style={{ marginTop: '70px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
        <p>© 2026 AI Translator • Built with Spring Boot & React</p>
      </footer>
    </div>
  );
}

export default App;
