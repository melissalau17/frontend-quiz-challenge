import { useState, useEffect } from "react";
import GameOver from "./components/game-over"
import QuestionCard from "./components/question-card"
import StartScreen from "./components/start-screen"
import type { GameState, Question } from "./types/quiz";
import { fetchTriviaQuestions } from "./api/triviaApi";
import Timer from "./components/timer";

function App() {
    const [gameState, setGameState] = useState<GameState>("start");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let timer: number;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === "playing") {
            setGameState("game-over");
        }
        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

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
            setCurrentQuestion(0);
        } catch (err) {
            console.error("Failed to fetch questions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (index: number): void => {
        setSelectedAnswer(index);
        const isCorrect = questions[currentQuestion].correctAnswer;

        if (isCorrect)  {
            setScore((prev) => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length -1) {
                setCurrentQuestion((prev) => prev + 1);
                setSelectedAnswer(null);
            } else {
                setGameState("game-over");
            }
        }, 1500); 
    };

    const handleNext = () => {
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setGameState("game-over");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-md"> 
                {gameState === "start" && <StartScreen onStart={handleStart} />}
                {gameState === "playing" && (
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
                )}
                {gameState === "game-over" && <GameOver score={score} totalQuestions={questions.length} onRestart={handleStart} />}
            </div>
        </div>
    );
}

export default App
