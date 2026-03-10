export type QuizQuestion = {
  id: string;
  prompt: string;
  options: Array<{ label: string; value: string }>;
};
