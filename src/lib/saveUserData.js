// frontend/src/lib/saveUserData.js
// Utility to save all user data and progress before logout
import axios from 'axios';

// Save quiz progress if any (example: from localStorage or global state)
async function saveQuizProgress() {
  const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || 'null');
  const token = localStorage.getItem('token');
  if (quizProgress && quizProgress.quizId && quizProgress.answers) {
    try {
      await axios.post(
        `https://eduminds-production-180d.up.railway.app/api/quiz/save-progress/${quizProgress.quizId}`,
        { answers: quizProgress.answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // Optionally log error
    }
  }
}

// Save lesson progress if any (example: from localStorage or global state)
async function saveLessonProgress() {
  const lessonProgress = JSON.parse(localStorage.getItem('completedLessonsMap') || '{}');
  const token = localStorage.getItem('token');
  // For each course, send completed lessons
  for (const courseId in lessonProgress) {
    try {
      await axios.put(
        `https://eduminds-production-180d.up.railway.app/api/enrollments/${courseId}/progress`,
        { progress: (lessonProgress[courseId].length / 1) * 100 }, // Placeholder: backend should recalc
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // Optionally log error
    }
  }
}

// Save user info if any unsaved changes (optional, can be expanded)
async function saveUserInfo() {
  // Example: if you have a dirty flag or unsaved form, send it here
}

export async function saveAllUserDataBeforeLogout() {
  await Promise.all([
    saveQuizProgress(),
    saveLessonProgress(),
    saveUserInfo(),
  ]);
}
