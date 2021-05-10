import { Answer, User } from "./Types";

interface Event<Args, Callback = never> {
  args: Args;
  callback: Callback;
}

export interface ClientEvents {
  askRoomCode: Event<null, string>;
  createRoom: Event<{ roomCode: string }, { users?: User[]; answers?: Answer[] }>;
  joinRoom: Event<{ userName: string; roomCode: string }>;
  sendAnswer: Event<{ userName: string; answer: string; roomCode: string }>;
  toggleAnswerCorrectnessServer: Event<{ userName: string; roomCode: string }>;
  nextQuestionServer: Event<{ roomCode: string; answerTime: number }>;
  endQuestionServer: Event<{ roomCode: string }>;
  validateRoomCode: Event<{ roomCode: string }, boolean>;
}

export interface ServerEvents {
  nextQuestion: Event<{ endDate: string }>;
  answer: Event<Answer>;
  setAnswerCorrectness: Event<{ isCorrect: boolean }>;
  users: Event<User[]>;
  endQuestion: Event<never>;
}
