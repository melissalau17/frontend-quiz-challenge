import { Play } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
  userName: string;
}

export default function StartScreen({ onStart, userName }: StartScreenProps) {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Coding Quiz Game
      </h1>
      <p className="text-gray-600 mb-6">Hello, {userName}! Test your programming knowledge.</p>
      <button 
        onClick={onStart}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Play className="w-5 h-5 mr-2" />
        Start Quiz
      </button>
    </div>
  );
}
