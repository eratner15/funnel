import React, { useState, useEffect, useRef } from 'react';
import GoldButton from '../components/GoldButton';
import ProgressBar from '../components/ProgressBar';
import { QUIZ_BANK } from '../data/quizzes';
import { CURRENT_PARSHA } from '../data/parsha';

const ANSWER_LETTERS = ['A', 'B', 'C', 'D'];
const BASE_XP_PER_CORRECT = 8;
const MAX_HEARTS = 3;

function getQuestions() {
  const parshaKey = CURRENT_PARSHA ? CURRENT_PARSHA.name : Object.keys(QUIZ_BANK)[0];
  const bank = QUIZ_BANK[parshaKey] || QUIZ_BANK[Object.keys(QUIZ_BANK)[0]] || [];
  return bank.slice(0, 5);
}

export default function QuizScreen({ userHook, awardXP, onBack }) {
  const questions = getQuestions();
  const totalQuestions = questions.length;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(userHook.user.hearts);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [hasFinished, setHasFinished] = useState(false);
  const explanationTimerRef = useRef(null);

  // Sync hearts with userHook when they change externally
  useEffect(() => {
    setHearts(userHook.user.hearts);
  }, [userHook.user.hearts]);

  // Cleanup explanation timer on unmount
  useEffect(() => {
    return () => {
      if (explanationTimerRef.current) clearTimeout(explanationTimerRef.current);
    };
  }, []);

  // Guard: no questions available
  if (!questions.length) {
    return (
      <div className="screen quiz-screen">
        <div className="container">
          <p>No quiz questions available.</p>
          <GoldButton onClick={onBack}>Return Home</GoldButton>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const correctIndex = question.correct;

  /* ── Handlers ── */

  const handleSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === correctIndex;

    // Record answer
    setAnswers((prev) => [
      ...prev,
      { questionIndex: currentQuestion, selected: answerIndex, isCorrect },
    ]);

    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      userHook.loseHeart();
      setHearts((h) => Math.max(0, h - 1));
    }

    // Reveal explanation after a short delay
    explanationTimerRef.current = setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const handleNext = () => {
    if (currentQuestion + 1 >= totalQuestions) {
      setQuizComplete(true);
    } else {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleFinish = () => {
    if (hasFinished) return;
    setHasFinished(true);
    const xpEarned = score * BASE_XP_PER_CORRECT;
    awardXP(xpEarned);
    userHook.completeMission('quiz', { score, xp: xpEarned });
    userHook.incrementQuizzes();
    userHook.addAchievement('first_quiz');
    onBack();
  };

  /* ── Out of Hearts ── */

  if (hearts <= 0 && !quizComplete) {
    return (
      <div className="screen quiz-screen">
        <div className="container quiz-hearts-empty fade-in-up">
          <div className="hearts-empty-icon">💔</div>
          <h2>Out of Hearts</h2>
          <p>Hearts regenerate over time. Come back soon!</p>
          <GoldButton onClick={onBack}>Return Home</GoldButton>
        </div>
      </div>
    );
  }

  /* ── Results Screen ── */

  if (quizComplete) {
    const xpEarned = score * BASE_XP_PER_CORRECT;

    let performanceMessage;
    if (score === totalQuestions) {
      performanceMessage = 'Mazel Tov!';
    } else if (score === totalQuestions - 1) {
      performanceMessage = 'Well Done!';
    } else if (score === totalQuestions - 2) {
      performanceMessage = 'Good Effort!';
    } else {
      performanceMessage = 'Keep Learning!';
    }

    return (
      <div className="screen quiz-screen">
        <div className="container quiz-results fade-in-up">
          <div className="results-score">
            <span className="results-score-num">{score}</span>
            <span className="results-score-sep">/</span>
            <span className="results-score-total">{totalQuestions}</span>
          </div>

          <h2 className="results-message">{performanceMessage}</h2>

          <div className="results-details">
            <div className="results-row">
              <span className="results-label">Hearts Remaining</span>
              <span className="results-value">
                {Array.from({ length: MAX_HEARTS }, (_, i) =>
                  i < hearts ? '❤️' : '🤍'
                ).join(' ')}
              </span>
            </div>
            <div className="results-row">
              <span className="results-label">XP Earned</span>
              <span className="results-value results-xp">+{xpEarned} XP</span>
            </div>
          </div>

          <GoldButton onClick={handleFinish}>Continue</GoldButton>
        </div>
      </div>
    );
  }

  /* ── Question Screen ── */

  return (
    <div className="screen quiz-screen">
      <div className="container">

        {/* Top bar */}
        <div className="quiz-top-bar fade-in-up">
          <button className="quiz-back-btn" onClick={onBack} aria-label="Go back">
            ←
          </button>

          <div className="quiz-progress">
            <ProgressBar
              value={currentQuestion + 1}
              max={totalQuestions}
              height={6}
            />
          </div>

          <div className="quiz-hearts" aria-label={`${hearts} hearts remaining`}>
            {Array.from({ length: MAX_HEARTS }, (_, i) => (
              <span key={i} className="quiz-heart">
                {i < hearts ? '❤️' : '🤍'}
              </span>
            ))}
          </div>
        </div>

        {/* Question label */}
        <p className="quiz-question-label fade-in-up" style={{ animationDelay: '0.04s' }}>
          QUESTION {currentQuestion + 1} OF {totalQuestions}
        </p>

        {/* Question text */}
        <h2 className="quiz-question-text fade-in-up" style={{ animationDelay: '0.08s' }}>
          {question.question}
        </h2>

        {/* Answer options */}
        <div className="quiz-options fade-in-up" style={{ animationDelay: '0.12s' }}>
          {question.options.map((option, idx) => {
            let optionClass = 'quiz-option';
            if (selectedAnswer !== null) {
              if (idx === correctIndex) {
                optionClass += ' correct';
              } else if (idx === selectedAnswer && idx !== correctIndex) {
                optionClass += ' incorrect';
              }
            } else if (idx === selectedAnswer) {
              optionClass += ' selected';
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => handleSelect(idx)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">{ANSWER_LETTERS[idx]}</span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation card */}
        {showExplanation && (
          <div className="quiz-explanation fade-in-up">
            <div className="explanation-card">
              <p className="explanation-text">{question.explanation}</p>
              {question.source && (
                <p className="explanation-source">{question.source}</p>
              )}
            </div>
            <GoldButton onClick={handleNext}>
              {currentQuestion + 1 < totalQuestions ? 'Next Question →' : 'See Results →'}
            </GoldButton>
          </div>
        )}

      </div>
    </div>
  );
}
