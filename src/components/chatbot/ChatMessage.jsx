import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatMessage({ message, onAddToList }) {
  const isUser = !message.fromBot;

  // Determine if this bot message can be added to the list
  // Skip: error messages, restricted topic messages, welcome message
  const canAddToList =
    !isUser &&
    onAddToList &&
    !message.isError &&
    message.text !==
    'I can only answer questions related to Java, Spring, and React interview topics.' &&
    !message.text.includes(
      'Hello! I am your Interview Prep Assistant'
    );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '10px 14px',
          borderRadius: 14,
          borderBottomRightRadius: isUser ? 4 : 14,
          borderBottomLeftRadius: isUser ? 14 : 4,
          background: isUser ? '#3b82f6' : 'var(--color-background-secondary)',
          color: isUser ? '#fff' : 'var(--color-text-primary)',
          fontSize: 14,
          lineHeight: 1.6,
          wordWrap: 'break-word',
          border: isUser
            ? 'none'
            : '0.5px solid var(--color-border-tertiary)',
        }}
      >
        {isUser ? (
          <div>{message.text}</div>
        ) : (
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
                  <code
                    style={{
                      background: 'rgba(0,0,0,0.08)',
                      padding: '2px 5px',
                      borderRadius: 4,
                      fontSize: 13,
                      fontFamily: 'var(--font-mono)',
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p style={{ margin: '0 0 8px 0' }}>{children}</p>;
              },
              ul({ children }) {
                return (
                  <ul style={{ margin: '0 0 8px 16px', padding: 0 }}>
                    {children}
                  </ul>
                );
              },
              ol({ children }) {
                return (
                  <ol style={{ margin: '0 0 8px 16px', padding: 0 }}>
                    {children}
                  </ol>
                );
              },
              li({ children }) {
                return <li style={{ marginBottom: 4 }}>{children}</li>;
              },
              strong({ children }) {
                return (
                  <strong
                    style={{
                      color: isUser ? '#fff' : '#3b82f6',
                      fontWeight: 600,
                    }}
                  >
                    {children}
                  </strong>
                );
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
        <div
          style={{
            fontSize: 10,
            color: isUser
              ? 'rgba(255,255,255,0.7)'
              : 'var(--color-text-tertiary)',
            marginTop: 4,
            textAlign: 'right',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>{message.timestamp}</span>
          {canAddToList && (
            <button
              onClick={() => onAddToList(message)}
              title="Add this Q&A to your interview list"
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontSize: 11,
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              <span>➕</span>
              <span>Add to List</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

