import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import type { Question } from "../types/quiz";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  currentQuestion: number;
  total: number;
  onNext: () => void;
}

export default function QuestionCard({ question, selectedAnswer, onAnswerSelect, currentQuestion, total, onNext }: QuestionCardProps) {
    const getButtonClass =  (answer: string): string => {
        if (selectedAnswer === null) return "hover:bg-gray-100";
        const selectedAnswerText = question.answers[selectedAnswer];

        if (answer === question.correctAnswer) return "bg-green-100 border-green-500";
        if (answer === selectedAnswerText) return "bg-red-100 border-red-500";
        return "opacity-50"
    };
    const [showInfo, setShowInfo] = useState(false);
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Question {currentQuestion + 1} of {total}
            </h2>

            <p className="text-gray-600 mb-4">{question.question}</p>

            <div className="space-y-3">
                {question.answers.map((answer, i) => (
                <button
                    key={i}
                    onClick={() => selectedAnswer === null && onAnswerSelect(i)}
                    className={`w-full p-4 text-left border rounded-lg transition-all duration-300 ${getButtonClass(answer)}`}
                >
                    <div className="flex items-center justify-between">
                        <span>{answer}</span>
                        {selectedAnswer !== null && answer === question.correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {selectedAnswer !== null && selectedAnswer === i && answer !== question.correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )}
                    </div>        
                </button>
                ))}
            </div>

            <button
                onClick={() => setShowInfo((prev) => !prev)}
                className="mt-4 text-blue-600 underline hover:text-blue-800 transition"
            >
            {showInfo ? "Hide Info" : "Show Category & Difficulty"}
        </button>

        {showInfo && (
            <div className="mt-2 text-sm text-gray-500 border-t pt-2">
            <p>Category: {question.category}</p>
            <p>Difficulty: {question.difficulty}</p>
            </div>
        )}

            <button
                onClick={onNext}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Next Question
                </button>

            <div className="mt-4 text-sm text-gray-500">
                <p>Category: {question.category}</p>
                <p>Difficulty: {question.difficulty}</p>
            </div>
        </div>
    );
}
