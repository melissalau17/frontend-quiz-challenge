export function ResumePrompt({ onResume, onRestart }: { onResume: () => void; onRestart: () => void }) {
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume Quiz?</h2>
      <p className="text-gray-600 mb-6">You have an unfinished quiz. Do you want to continue?</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onResume}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Continue
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
