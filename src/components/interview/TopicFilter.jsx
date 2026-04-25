import React from 'react';

const TOPICS = [
  { id: 'all', label: 'All', color: '#6b7280' },
  { id: 'java', label: 'Java', color: '#f59e0b' },
  { id: 'spring', label: 'Spring', color: '#10b981' },
  { id: 'database', label: 'Database', color: '#3b82f6' },
  { id: 'kafka', label: 'Kafka', color: '#8b5cf6' },
  { id: 'cicd', label: 'CI/CD', color: '#ec4899' },
  { id: 'reactjs', label: 'ReactJS', color: '#06b6d4' },
  { id: 'ai', label: 'AI', color: '#f43f5e' },
  { id: 'tricky', label: 'Tricky', color: '#ef4444' }
];

export default function TopicFilter({ selectedTopic, onTopicChange, questionCounts }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
        Filter by Topic
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {TOPICS.map(topic => {
          const count = questionCounts[topic.id] || 0;
          const isSelected = selectedTopic === topic.id;
          
          return (
            <button
              key={topic.id}
              onClick={() => onTopicChange(topic.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: 'none',
                background: isSelected ? topic.color : 'var(--color-background-secondary)',
                color: isSelected ? '#fff' : 'var(--color-text-primary)',
                fontSize: 13,
                fontWeight: isSelected ? 500 : 400,
                cursor: 'pointer',
                transition: 'all .2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {topic.label}
              {topic.id !== 'all' && (
                <span style={{
                  background: isSelected ? 'rgba(255,255,255,0.3)' : 'var(--color-border-tertiary)',
                  padding: '2px 6px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 500
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}