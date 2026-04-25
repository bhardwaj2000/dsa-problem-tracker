import React, { useState } from 'react';

const TOPICS = ['Java', 'Spring', 'Database', 'Kafka', 'CICD', 'ReactJS', 'AI', 'Tricky'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

function getInitialFormData(initialData) {
  if (initialData) {
    return {
      question: initialData.question || '',
      answer: initialData.answer || '',
      topic: initialData.topic || 'Java',
      difficulty: initialData.difficulty || 'Medium',
      tags: initialData.tags || '',
    };
  }
  return {
    question: '',
    answer: '',
    topic: 'Java',
    difficulty: 'Medium',
    tags: '',
  };
}

export default function AddQuestionModal({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(getInitialFormData(initialData));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const isAiGenerated = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await onSubmit({
        question: formData.question,
        answer: formData.answer,
        topic: formData.topic,
        difficulty: formData.difficulty,
        tags,
      });

      onClose();
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to add question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-background-primary)',
          borderRadius: 12,
          width: '100%',
          maxWidth: 700,
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 500,
                margin: 0,
                color: 'var(--color-text-primary)',
              }}
            >
              {isAiGenerated ? 'Add AI-Generated Question' : 'Add Interview Question'}
            </h3>
            {isAiGenerated && (
              <span
                style={{
                  padding: '3px 10px',
                  background: 'rgba(59,130,246,0.1)',
                  color: '#3b82f6',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 500,
                  border: '0.5px solid rgba(59,130,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>🤖</span>
                <span>AI-generated</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Question */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
                color: 'var(--color-text-secondary)',
              }}
            >
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              required
              placeholder="E.g., Explain the internal working of HashMap in Java"
              style={{
                width: '100%',
                minHeight: 80,
                padding: 10,
                borderRadius: 8,
                border: '0.5px solid var(--color-border-secondary)',
                background: 'var(--color-background-primary)',
                color: 'var(--color-text-primary)',
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Answer */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                }}
              >
                Answer * (Markdown supported)
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: 12,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {!showPreview ? (
              <textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                required
                placeholder="Use **bold**, `code`, and ```language for code blocks"
                style={{
                  width: '100%',
                  minHeight: 200,
                  padding: 10,
                  borderRadius: 8,
                  border: '0.5px solid var(--color-border-secondary)',
                  background: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  resize: 'vertical',
                }}
              />
            ) : (
              <div
                style={{
                  padding: 12,
                  background: 'var(--color-background-secondary)',
                  borderRadius: 8,
                  minHeight: 200,
                  fontSize: 14,
                  lineHeight: 1.7,
                  border: '0.5px solid var(--color-border-secondary)',
                }}
              >
                {formData.answer || (
                  <span
                    style={{
                      color: 'var(--color-text-tertiary)',
                      fontStyle: 'italic',
                    }}
                  >
                    Preview will appear here...
                  </span>
                )}
              </div>
            )}

            <div
              style={{
                fontSize: 11,
                color: 'var(--color-text-tertiary)',
                marginTop: 4,
              }}
            >
              💡 Tip: Use ```java for code blocks, **bold**, *italic*, `inline code`
            </div>
          </div>

          {/* Topic and Difficulty */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                  color: 'var(--color-text-secondary)',
                }}
              >
                Topic *
              </label>
              <select
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '0.5px solid var(--color-border-secondary)',
                  background: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 14,
                }}
              >
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                  color: 'var(--color-text-secondary)',
                }}
              >
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '0.5px solid var(--color-border-secondary)',
                  background: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 14,
                }}
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
                color: 'var(--color-text-secondary)',
              }}
            >
              Tags (comma-separated, optional)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="E.g., collections, concurrency, interview"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '0.5px solid var(--color-border-secondary)',
                background: 'var(--color-background-primary)',
                color: 'var(--color-text-primary)',
                fontSize: 14,
              }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: 12,
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Question'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: 12,
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-primary)',
                border: '0.5px solid var(--color-border-secondary)',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

