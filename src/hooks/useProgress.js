import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';



export function useProgress(problems = []) {
  const { currentUser } = useAuth();
  const [statuses, setStatuses] = useState({});
  const [stats, setStats] = useState({
    total: problems.length,
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

    const oldStatus = statuses[problemId];
    const newStatuses = { ...statuses, [problemId]: newStatus };

    // Incremental stat updates (more reliable than full recalculation)
    let doneDelta = 0;
    let inProgressDelta = 0;
    let easyDelta = 0;
    let mediumDelta = 0;
    let hardDelta = 0;

    if (oldStatus === "Done") doneDelta--;
    if (oldStatus === "In Progress") inProgressDelta--;
    if (newStatus === "Done") doneDelta++;
    if (newStatus === "In Progress") inProgressDelta++;

    if (oldStatus === "Done") {
      if (difficulty === "Easy") easyDelta--;
      else if (difficulty === "Medium") mediumDelta--;
      else if (difficulty === "Hard") hardDelta--;
    }
    if (newStatus === "Done") {
      if (difficulty === "Easy") easyDelta++;
      else if (difficulty === "Medium") mediumDelta++;
      else if (difficulty === "Hard") hardDelta++;
    }

    const newStats = {
      total: problems.length,
      done: stats.done + doneDelta,
      inProgress: stats.inProgress + inProgressDelta,
      easyDone: stats.easyDone + easyDelta,
      mediumDone: stats.mediumDone + mediumDelta,
      hardDone: stats.hardDone + hardDelta,
      problemStatuses: newStatuses,
      lastUpdated: new Date()
    };

    // Update locally first (optimistic update)
    setStatuses(newStatuses);
    setStats(newStats);

    // Update Firestore
    const progressRef = doc(db, 'users', currentUser.uid, 'progress', 'stats');
    await setDoc(progressRef, newStats);
  };

  return { statuses, stats, updateStatus, loading };
}
