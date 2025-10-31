import { useState, useEffect } from "react";
import GameOver from "./components/game-over";
import QuestionCard from "./components/question-card";
import StartScreen from "./components/start-screen";
import LoginScreen from "./components/login-screen";
import { ResumePrompt } from "./components/resume-prompt";
import type { GameState, Question } from "./types/quiz";
import { fetchTriviaQuestions } from "./api/triviaApi";
import Timer from "./components/timer";

function App() {
  const [gameState, setGameState] = useState<GameState>("login");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    let timer: number;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("game-over");
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (name: string) => {
    const newUser = { name };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setGameState("start");
  };

  const handleStart = async () => {
    setGameState("playing");
    setTimeLeft(30);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setLoading(true);

    try {
      const data = await fetchTriviaQuestions(10);
      setQuestions(data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      const quizState = {
        gameState,
        currentQuestion,
        score,
        selectedAnswer,
        timeLeft,
        questions,
      };
      localStorage.setItem("quizState", JSON.stringify(quizState));
    }
  }, [gameState, currentQuestion, score, selectedAnswer, timeLeft, questions]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const isCorrect = questions[currentQuestion].correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameState("game-over");
      }
    }, 1500);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length)
      setCurrentQuestion((prev) => prev + 1);
    else setGameState("game-over");
  };

  const handleResume = () => {
    const savedState = localStorage.getItem("quizState");
    if (!savedState) return;

    const {
      gameState,
      currentQuestion,
      score,
      selectedAnswer,
      timeLeft,
      questions,
    } = JSON.parse(savedState);

    setGameState(gameState);
    setCurrentQuestion(currentQuestion);
    setScore(score);
    setSelectedAnswer(selectedAnswer);
    setTimeLeft(timeLeft);
    setQuestions(questions);
  };

  const handleRestartAfterResume = () => {
    localStorage.removeItem("quizState");
    setGameState("start");
  };

  useEffect(() => {
    const savedState = localStorage.getItem("quizState");
    const savedUser = localStorage.getItem("user");

    if (savedUser) setUser(JSON.parse(savedUser));

    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed.gameState === "playing") {
        setGameState("resume-prompt");
      }
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setGameState("login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-md">
        {gameState === "login" ? (
          <LoginScreen onLogin={handleLogin} />
        ) : gameState === "resume-prompt" ? (
          <ResumePrompt
            onResume={handleResume}
            onRestart={handleRestartAfterResume}
          />
        ) : gameState === "start" ? (
          <StartScreen onStart={handleStart} userName={user?.name || ""} />
        ) : gameState === "playing" ? (
          <div className="p-8">
            <Timer timeLeft={timeLeft} />
            {loading ? (
              <p>Loading questions...</p>
            ) : (
              <>
                <QuestionCard
                  question={questions[currentQuestion]}
                  onAnswerSelect={handleAnswer}
                  selectedAnswer={selectedAnswer}
                  currentQuestion={currentQuestion}
                  total={questions.length}
                  onNext={handleNext}
                />
                <div className="mt-6 text-center text-gray-600">
                  Score: {score}/{questions.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <GameOver
            score={score}
            totalQuestions={questions.length}
            onRestart={handleStart}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

export default App;