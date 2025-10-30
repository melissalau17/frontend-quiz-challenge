import type { Question } from "../types/quiz";

function decodeHtml(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function shuffleAnswers(correct: string, incorrect: string[]): string[] {
  const allAnswers = [...incorrect, correct];
  return allAnswers.sort(() => Math.random() - 0.5);
}

export async function fetchTriviaQuestions(amount = 10): Promise<Question[]> {
  const res = await fetch(`https://opentdb.com/api.php?amount=${amount}`);
  const data = await res.json();

  if (data.response_code !== 0) {
    throw new Error("Failed to fetch trivia questions");
  }

  return data.results.map((item: any): Question => {
    const correctAnswer = decodeHtml(item.correct_answer);
    const incorrectAnswers = item.incorrect_answers.map((ans: string) =>
      decodeHtml(ans)
    );
    const answers = shuffleAnswers(correctAnswer, incorrectAnswers);

    return {
      category: decodeHtml(item.category),
      type: item.type,
      difficulty: item.difficulty,
      question: decodeHtml(item.question),
      correctAnswer,
      incorrectAnswers,
      answers,
    };
  });
}
