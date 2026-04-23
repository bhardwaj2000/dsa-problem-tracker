import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useProgress() {
  const { currentUser } = useAuth();
  const [statuses, setStatuses] = useState({});
  const [stats, setStats] = useState({
    total: 164,
    done: 0,
    inProgress: 0,
    easyDone: 0,
    mediumDone: 0,
    hardDone: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const progressRef = doc(db, 'users', currentUser.uid, 'progress', 'stats');
    
    // Real-time listener
    const unsubscribe = onSnapshot(progressRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setStatuses(data.problemStatuses || {});
        setStats({
          total: data.total || 164,
          done: data.done || 0,
          inProgress: data.inProgress || 0,
          easyDone: data.easyDone || 0,
          mediumDone: data.mediumDone || 0,
          hardDone: data.hardDone || 0
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateStatus = async (problemId, newStatus, difficulty) => {
    if (!currentUser) return;

    const newStatuses = { ...statuses, [problemId]: newStatus };
    
    // Calculate new stats
    const allProblems = Object.values(newStatuses);
    const done = allProblems.filter(s => s === "Done").length;
    const inProgress = allProblems.filter(s => s === "In Progress").length;
    
    // Calculate difficulty-specific stats (you'll need problem data here)
    // For now, simplified:
    const newStats = {
      total: 164,
      done,
      inProgress,
      easyDone: stats.easyDone, // Update based on difficulty
      mediumDone: stats.mediumDone,
      hardDone: stats.hardDone,
      problemStatuses: newStatuses,
      lastUpdated: new Date()
    };

    // Update locally first (optimistic update)
    setStatuses(newStatuses);
    
    // Update Firestore
    const progressRef = doc(db, 'users', currentUser.uid, 'progress', 'stats');
    await setDoc(progressRef, newStats);
  };

  return { statuses, stats, updateStatus, loading };
}