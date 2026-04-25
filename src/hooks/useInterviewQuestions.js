import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useInterviewQuestions() {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [starredQuestions, setStarredQuestions] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all public interview questions
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const questionsRef = collection(db, 'interviewQuestions');
    const q = query(questionsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const questionsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(questionsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch user's starred questions
  useEffect(() => {
    if (!currentUser) return;

    const starredRef = collection(db, 'users', currentUser.uid, 'starredQuestions');
    
    const unsubscribe = onSnapshot(starredRef, (snapshot) => {
      const starred = {};
      snapshot.docs.forEach(doc => {
        starred[doc.id] = doc.data();
      });
      setStarredQuestions(starred);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Add new question
  const addQuestion = async (questionData) => {
    if (!currentUser) return;

    try {
      const questionsRef = collection(db, 'interviewQuestions');
      await addDoc(questionsRef, {
        ...questionData,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp(),
        reviewCount: 0,
        lastReviewed: null
      });
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  };

  // Update question
  const updateQuestion = async (questionId, updates) => {
    if (!currentUser) return;

    try {
      const questionRef = doc(db, 'interviewQuestions', questionId);
      await updateDoc(questionRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  };

  // Delete question
  const deleteQuestion = async (questionId) => {
    if (!currentUser) return;

    try {
      const questionRef = doc(db, 'interviewQuestions', questionId);
      await deleteDoc(questionRef);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  };

  // Toggle star
  const toggleStar = async (questionId) => {
    if (!currentUser) return;

    try {
      const starRef = doc(db, 'users', currentUser.uid, 'starredQuestions', questionId);
      
      if (starredQuestions[questionId]) {
        // Remove star
        await deleteDoc(starRef);
      } else {
        // Add star
        await addDoc(starRef, {
          questionId,
          starredAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      throw error;
    }
  };

  // Update user notes for a question
  const updateNotes = async (questionId, notes) => {
    if (!currentUser) return;

    try {
      const starRef = doc(db, 'users', currentUser.uid, 'starredQuestions', questionId);
      await updateDoc(starRef, {
        notes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      throw error;
    }
  };

  // Mark as reviewed
  const markAsReviewed = async (questionId) => {
    if (!currentUser) return;

    try {
      const questionRef = doc(db, 'interviewQuestions', questionId);
      const question = questions.find(q => q.id === questionId);
      
      await updateDoc(questionRef, {
        reviewCount: (question?.reviewCount || 0) + 1,
        lastReviewed: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking as reviewed:', error);
      throw error;
    }
  };

  return {
    questions,
    starredQuestions,
    loading,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    toggleStar,
    updateNotes,
    markAsReviewed
  };
}