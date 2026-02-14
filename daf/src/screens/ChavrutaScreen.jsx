import React, { useState, useRef, useEffect } from 'react';
import GoldButton from '../components/GoldButton';
import { CHAVRUTA_RESPONSES } from '../data/chavruta';

const SUGGESTED_PROMPTS = [
  'What is Mishpatim about?',
  "Tell me about 'eye for an eye'",
  'What does Torah say about slavery?',
  "Why help your enemy's donkey?",
];

export default function ChavrutaScreen({ userHook, awardXP, onBack }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Shalom! I'm your AI Chavruta \u2014 your Torah study partner. This week we're studying Parashat Mishpatim. What would you like to explore?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef(null);

  const userMessageCount = messages.filter((m) => m.role === 'user').length;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const findResponse = (userText) => {
    const lower = userText.toLowerCase();
    const defaultResponse = CHAVRUTA_RESPONSES[0];

    for (let i = 1; i < CHAVRUTA_RESPONSES.length; i++) {
      const entry = CHAVRUTA_RESPONSES[i];
      if (entry.keywords && entry.keywords.length > 0) {
        const matched = entry.keywords.some((kw) => lower.includes(kw.toLowerCase()));
        if (matched) return entry.response;
      }
    }

    return defaultResponse.response;
  };

  const handleSend = (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;

    const newMessages = [...messages, { role: 'user', text: messageText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiText = findResponse(messageText);
      setMessages((prev) => [...prev, { role: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    handleSend(prompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleComplete = () => {
    awardXP(30);
    userHook.completeMission('chavruta', { xp: 30 });
    onBack();
  };

  return (
    <div className="screen chavruta-screen">
      <div className="chavruta-header">
        <button className="back-button" onClick={onBack}>←</button>
        <div className="chavruta-header-text">
          <h2>AI Chavruta</h2>
          <span className="chavruta-subtitle">
            <span className="online-dot"></span>
            Powered by Sefaria + AI
          </span>
        </div>
      </div>

      <div className="chat-area" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            {msg.role === 'ai' && (
              <div className="chat-avatar ai-avatar">🤖</div>
            )}
            <div className="chat-bubble">
              <p className="chat-text">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        {userMessageCount >= 3 && (
          <div className="session-complete-indicator">
            Session milestone reached!
          </div>
        )}
      </div>

      {messages.length < 3 && !isTyping && (
        <div className="suggested-prompts">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              className="prompt-pill"
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {userMessageCount >= 3 && (
        <div className="floating-complete-button">
          <GoldButton onClick={handleComplete}>
            Complete +30 XP
          </GoldButton>
        </div>
      )}

      <div className="chavruta-input-area">
        <input
          type="text"
          className="chavruta-input"
          placeholder="Ask your Chavruta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button
          className="send-button"
          onClick={() => handleSend()}
          disabled={isTyping || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
