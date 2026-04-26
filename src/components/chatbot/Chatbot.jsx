import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../../services/geminiService';
import { generateQuestionMetadata } from '../../services/aiMetadataService';
import ChatMessage from './ChatMessage';
import AddQuestionModal from '../interview/AddQuestionModal';

const AVAILABLE_MODELS = [
  { value: 'gemma-3-27b-it', label: 'Gemma 3 27B' },
  { value: '', label: 'Default (Worker)' },
  { value: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash' },
  { value: 'gemma-4-31b-it', label: 'Gemma 4 31B' }
];

export default function Chatbot({ onAddQuestion }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [messages, setMessages] = useState([
    {
      text: 'Hello! I am your Interview Prep Assistant. Ask me anything about **Java**, **Spring Boot**, or **React** interview topics.',
      fromBot: true,
      timestamp: formatTime(new Date()),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [preFillData, setPreFillData] = useState(null);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastUserQuestion = useRef('');

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();

    // Input validation
    if (!trimmed) {
      setError('Please enter a question.');
      return;
    }
    if (trimmed.length < 3) {
      setError('Question too short. Please be more specific.');
      return;
    }
    if (trimmed.length > 500) {
      setError('Question too long. Please limit to 500 characters.');
      return;
    }

    setError('');
    setInputValue('');

    // Track the last user question for metadata generation
    lastUserQuestion.current = trimmed;

    // Add user message
    const userMsg = {
      text: trimmed,
      fromBot: false,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Call Gemini API with selected model
    const response = await sendMessageToGemini(trimmed, selectedModel);

    setMessages((prev) => [
      ...prev,
      {
        text: response.text,
        fromBot: true,
        timestamp: formatTime(new Date()),
        isError: !response.ok,
      },
    ]);
    setLoading(false);
  }

  async function handleAddToList(botMessage) {
    if (!lastUserQuestion.current) return;

    setIsGeneratingMetadata(true);
    setError('');

    try {
      const metadata = await generateQuestionMetadata(
        lastUserQuestion.current,
        botMessage.text,
        selectedModel
      );

      setPreFillData({
        question: metadata.refinedQuestion || lastUserQuestion.current,
        answer: botMessage.text,
        topic: metadata.topic,
        difficulty: metadata.difficulty,
        tags: metadata.tags.join(', '),
      });
      setShowAddModal(true);
    } catch (err) {
      setError(`Failed to generate metadata: ${err.message}. Please try again.`);
    } finally {
      setIsGeneratingMetadata(false);
    }
  }

  async function handleModalSubmit(formData) {
    if (!onAddQuestion) return;

    try {
      // Tags may already be an array (from AddQuestionModal) or a string (from preFillData)
      const tags = Array.isArray(formData.tags)
        ? formData.tags
        : String(formData.tags || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

      await onAddQuestion({
        question: formData.question,
        answer: formData.answer,
        topic: formData.topic,
        difficulty: formData.difficulty,
        tags,
      });

      setShowAddModal(false);
      setPreFillData(null);

      // Show success confirmation in chat
      setMessages((prev) => [
        ...prev,
        {
          text: '✅ Question added to your interview list successfully!',
          fromBot: true,
          timestamp: formatTime(new Date()),
        },
      ]);
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question. Please try again.');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Open Interview Assistant"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        🤖
      </button>
    );
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 380,
          maxWidth: 'calc(100vw - 32px)',
          height: 560,
          maxHeight: 'calc(100vh - 48px)',
          background: 'var(--color-background-primary)',
          borderRadius: 16,
          border: '0.5px solid var(--color-border-secondary)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 200,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 16px',
            background: '#3b82f6',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Interview Assistant</div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              title="Select AI Model"
              style={{
                marginTop: 4,
                padding: '2px 6px',
                borderRadius: 4,
                border: '0.5px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: 11,
                cursor: 'pointer',
                outline: 'none',
                maxWidth: 170,
              }}
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.value} value={model.value} style={{ color: '#111827' }}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMessages([
                {
                  text: 'Hello! I am your Interview Prep Assistant. Ask me anything about **Java**, **Spring Boot**, or **React** interview topics.',
                  fromBot: true,
                  timestamp: formatTime(new Date()),
                },
              ])}
              title="Clear chat"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title="Close"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 12px',
            background: 'var(--color-background-secondary)',
          }}
        >
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg}
              onAddToList={!isGeneratingMetadata ? handleAddToList : undefined}
            />
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  background: 'var(--color-background-secondary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#3b82f6',
                    animation: 'chatbotPulse 1.2s infinite ease-in-out',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#3b82f6',
                    animation: 'chatbotPulse 1.2s infinite ease-in-out 0.2s',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#3b82f6',
                    animation: 'chatbotPulse 1.2s infinite ease-in-out 0.4s',
                    display: 'inline-block',
                  }}
                />
              </div>
            </div>
          )}

          {isGeneratingMetadata && (
            <div
              style={{
                padding: '8px 12px',
                background: 'rgba(59,130,246,0.1)',
                color: '#3b82f6',
                borderRadius: 8,
                fontSize: 12,
                marginBottom: 8,
                border: '0.5px solid rgba(59,130,246,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: '2px solid #3b82f6',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'chatbotSpin 0.8s linear infinite',
                  display: 'inline-block',
                }}
              />
              <span>AI is analyzing and categorizing this question...</span>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '8px 12px',
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                borderRadius: 8,
                fontSize: 12,
                marginBottom: 8,
                border: '0.5px solid rgba(239,68,68,0.2)',
              }}
            >
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '10px 12px',
            background: 'var(--color-background-primary)',
            borderTop: '0.5px solid var(--color-border-tertiary)',
            display: 'flex',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about Java, Spring, or React..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            disabled={loading || isGeneratingMetadata}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 10,
              border: '0.5px solid var(--color-border-secondary)',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-primary)',
              fontSize: 14,
              outline: 'none',
              opacity: loading || isGeneratingMetadata ? 0.6 : 1,
            }}
          />
          <button
            type="submit"
            disabled={loading || isGeneratingMetadata || !inputValue.trim()}
            style={{
              padding: '10px 16px',
              background: loading || isGeneratingMetadata ? '#93c5fd' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: loading || isGeneratingMetadata ? 'not-allowed' : 'pointer',
              transition: 'all .2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading || isGeneratingMetadata ? '...' : 'Send'}
          </button>
        </form>

        {/* Pulse animation style */}
        <style>{`
          @keyframes chatbotPulse {
            0%, 80%, 100% { opacity: 0.4; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
          @keyframes chatbotSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <AddQuestionModal
          onClose={() => {
            setShowAddModal(false);
            setPreFillData(null);
          }}
          onSubmit={handleModalSubmit}
          initialData={preFillData}
        />
      )}
    </>
  );
}

