export interface User {
  name: string;
}

export interface Answer {
  userName: string;
  answer: string;
  date: string;
  isCorrect?: boolean;
}
