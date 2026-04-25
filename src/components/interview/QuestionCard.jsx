import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../../contexts/AuthContext';

const TOPIC_COLORS = {
  java: '#f59e0b',
  spring: '#10b981',
  database: '#3b82f6',
  kafka: '#8b5cf6',
  cicd: '#ec4899',
  reactjs: '#06b6d4',
  ai: '#f43f5e',
  tricky: '#ef4444'
};

const DIFFICULTY_COLORS = {
  Easy: '#22c55e',
  Medium: '#f59e0b',
  Hard: '#ef4444'
};

export default function QuestionCard({ 
  question, 
  isStarred, 
  userNotes,
  onToggleStar, 
  onUpdateNotes,
  onDelete,
  onMarkReviewed 
}) {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(userNotes || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwnQuestion = question.userId === currentUser?.uid;

  const handleSaveNotes = () => {
    onUpdateNotes(question.id, notes);
    setIsEditingNotes(false);
  };

  const handleDelete = () => {
    onDelete(question.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: `0.5px solid ${isStarred ? '#fbbf24' : 'var(--color-border-tertiary)'}`,
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 10,
      transition: 'all .2s'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11,
              fontWeight: 500,
              color: DIFFICULTY_COLORS[question.difficulty] || '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              {question.difficulty}
            </span>
            
            <span style={{
              padding: '2px 8px',
              borderRadius: 6,
              background: TOPIC_COLORS[question.topic.toLowerCase()] || '#6b7280',
              color: '#fff',
              fontSize: 11,
              fontWeight: 500
            }}>
              {question.topic}
            </span>

            {question.tags && question.tags.map(tag => (
              <span key={tag} style={{
                padding: '2px 8px',
                borderRadius: 6,
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-secondary)',
                fontSize: 10,
                border: '0.5px solid var(--color-border-tertiary)'
              }}>
                {tag}
              </span>
            ))}
          </div>
          
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ 
              fontSize: 15, 
              fontWeight: 500, 
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              lineHeight: 1.5
            }}
          >
            {question.question}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
          <button
            onClick={() => onToggleStar(question.id)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              padding: 4
            }}
            title={isStarred ? 'Remove star' : 'Add star'}
          >
            {isStarred ? '⭐' : '☆'}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 16,
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: 4
            }}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          <div style={{
            marginTop: 12,
            padding: 12,
            background: 'var(--color-background-secondary)',
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'var(--color-text-primary)'
          }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Answer
            </div>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code style={{
                      background: 'rgba(0,0,0,0.1)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                      fontFamily: 'monospace'
                    }} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {question.answer}
            </ReactMarkdown>
          </div>

          {/* Personal Notes */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                My Notes (Private)
              </div>
              {!isEditingNotes && (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    fontSize: 12,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {notes ? 'Edit' : 'Add notes'}
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your personal notes here..."
                  style={{
                    width: '100%',
                    minHeight: 80,
                    padding: 10,
                    borderRadius: 8,
                    border: '0.5px solid var(--color-border-secondary)',
                    background: 'var(--color-background-primary)',
                    color: 'var(--color-text-primary)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={handleSaveNotes}
                    style={{
                      padding: '6px 14px',
                      background: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setNotes(userNotes || '');
                      setIsEditingNotes(false);
                    }}
                    style={{
                      padding: '6px 14px',
                      background: 'var(--color-background-secondary)',
                      color: 'var(--color-text-primary)',
                      border: '0.5px solid var(--color-border-secondary)',
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : notes ? (
              <div style={{
                padding: 10,
                background: 'var(--color-background-info)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--color-text-primary)',
                whiteSpace: 'pre-wrap'
              }}>
                {notes}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                No notes yet
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '0.5px solid var(--color-border-tertiary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            color: 'var(--color-text-secondary)'
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span>
                Added by: <strong>{question.userDisplayName}</strong>
              </span>
              <span>
                Reviewed: {question.reviewCount || 0} times
              </span>
              {question.lastReviewed && (
                <span>
                  Last: {formatDate(question.lastReviewed)}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => onMarkReviewed(question.id)}
                style={{
                  padding: '4px 12px',
                  background: 'var(--color-background-secondary)',
                  border: '0.5px solid var(--color-border-secondary)',
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)'
                }}
              >
                ✓ Mark Reviewed
              </button>

              {isOwnQuestion && (
                <>
                  {showDeleteConfirm ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={handleDelete}
                        style={{
                          padding: '4px 12px',
                          background: '#ef4444',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          color: '#fff'
                        }}
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        style={{
                          padding: '4px 12px',
                          background: 'var(--color-background-secondary)',
                          border: '0.5px solid var(--color-border-secondary)',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{
                        padding: '4px 12px',
                        background: 'none',
                        border: '0.5px solid #ef4444',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer',
                        color: '#ef4444'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}