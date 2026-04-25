import React, { useState, useMemo } from 'react';
import { useInterviewQuestions } from '../hooks/useInterviewQuestions';
import QuestionCard from '../components/interview/QuestionCard';
import AddQuestionModal from '../components/interview/AddQuestionModal';
import TopicFilter from '../components/interview/TopicFilter';

export default function InterviewPage() {
  const {
    questions,
    starredQuestions,
    loading,
    addQuestion,
    deleteQuestion,
    toggleStar,
    updateNotes,
    markAsReviewed
  } = useInterviewQuestions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);

  // Calculate question counts per topic
  const questionCounts = useMemo(() => {
    const counts = { all: questions.length };
    questions.forEach(q => {
      const topic = q.topic.toLowerCase();
      counts[topic] = (counts[topic] || 0) + 1;
    });
    return counts;
  }, [questions]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Topic filter
      if (selectedTopic !== 'all' && q.topic.toLowerCase() !== selectedTopic) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchQuestion = q.question.toLowerCase().includes(query);
        const matchAnswer = q.answer.toLowerCase().includes(query);
        const matchTags = q.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchQuestion && !matchAnswer && !matchTags) {
          return false;
        }
      }

      // Starred filter
      if (showOnlyStarred && !starredQuestions[q.id]) {
        return false;
      }

      return true;
    });
  }, [questions, selectedTopic, searchQuery, showOnlyStarred, starredQuestions]);

  // Stats
  const stats = useMemo(() => {
    const total = questions.length;
    const starred = Object.keys(starredQuestions).length;
    const byDifficulty = {
      Easy: questions.filter(q => q.difficulty === 'Easy').length,
      Medium: questions.filter(q => q.difficulty === 'Medium').length,
      Hard: questions.filter(q => q.difficulty === 'Hard').length
    };
    return { total, starred, byDifficulty };
  }, [questions, starredQuestions]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: 'var(--color-text-secondary)'
      }}>
        Loading interview questions...
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>Total Questions</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--color-text-primary)' }}>{stats.total}</div>
        </div>
        
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>Starred</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: '#fbbf24' }}>{stats.starred}</div>
        </div>

        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>Easy</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: '#22c55e' }}>{stats.byDifficulty.Easy}</div>
        </div>

        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>Medium</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: '#f59e0b' }}>{stats.byDifficulty.Medium}</div>
        </div>

        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>Hard</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: '#ef4444' }}>{stats.byDifficulty.Hard}</div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> Add Question
        </button>

        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '8px 12px',
            borderRadius: 8,
            border: '0.5px solid var(--color-border-secondary)',
            background: 'var(--color-background-primary)',
            color: 'var(--color-text-primary)',
            fontSize: 14
          }}
        />

        <button
          onClick={() => setShowOnlyStarred(!showOnlyStarred)}
          style={{
            padding: '8px 16px',
            background: showOnlyStarred ? '#fbbf24' : 'var(--color-background-secondary)',
            color: showOnlyStarred ? '#fff' : 'var(--color-text-primary)',
            border: '0.5px solid var(--color-border-secondary)',
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {showOnlyStarred ? '⭐' : '☆'} {showOnlyStarred ? 'Show All' : 'Starred Only'}
        </button>

        {(searchQuery || selectedTopic !== 'all' || showOnlyStarred) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('all');
              setShowOnlyStarred(false);
            }}
            style={{
              padding: '8px 16px',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-primary)',
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Topic Filter */}
      <TopicFilter
        selectedTopic={selectedTopic}
        onTopicChange={setSelectedTopic}
        questionCounts={questionCounts}
      />

      {/* Results Count */}
      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
        {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
        {(searchQuery || selectedTopic !== 'all' || showOnlyStarred) && ` (filtered from ${questions.length})`}
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--color-text-secondary)'
        }}>
          {questions.length === 0 ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>No questions yet</div>
              <div style={{ fontSize: 14 }}>Click "Add Question" to create your first interview question</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>No questions found</div>
              <div style={{ fontSize: 14 }}>Try adjusting your filters or search query</div>
            </>
          )}
        </div>
      ) : (
        <div>
          {filteredQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              isStarred={!!starredQuestions[question.id]}
              userNotes={starredQuestions[question.id]?.notes}
              onToggleStar={toggleStar}
              onUpdateNotes={updateNotes}
              onDelete={deleteQuestion}
              onMarkReviewed={markAsReviewed}
            />
          ))}
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <AddQuestionModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addQuestion}
        />
      )}
    </div>
  );
}