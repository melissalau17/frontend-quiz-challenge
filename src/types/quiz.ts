export type GameState = "login" | "start" | "playing" | "resume-prompt" | "game-over";

export interface Question {
    category: string;
    type: "multiple" | "boolean";
    difficulty: "easy" | "medium" | "hard";
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
    answers: string[];
}