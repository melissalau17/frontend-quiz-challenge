export function shuffleAnswers(correct, incorrect) {
  const answers = [...incorrect, correct];
  return answers.sort(() => Math.random() - 0.5);
}
