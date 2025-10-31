import { Trophy, LogOut } from "lucide-react";

interface GameOverProps {
  onRestart: () => void;
  onLogout: () => void;
  score: number;
  totalQuestions: number;
}

export default function GameOver({
  onRestart,
  onLogout,
  score,
  totalQuestions,
}: GameOverProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="p-8 text-center">
      <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over</h2>
      <p className="text-lg text-gray-600">
        Final Score: {score}/{totalQuestions}
      </p>
      <p className="mt-2 text-gray-500">({percentage}% correct)</p>

      <div className="mt-6 flex flex-col gap-3 items-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Play Again
        </button>

        <button
          onClick={onLogout}
          className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
