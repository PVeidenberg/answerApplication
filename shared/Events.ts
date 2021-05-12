import { Answer, SocketError, User } from "./Types";

export interface ClientToServerEvents {
  askRoomCode: (args: null, cb: (roomCode: string) => void) => void;
  createRoom: (cb: (err: SocketError | null, data: { roomCode: string }) => void) => void;
  joinRoomAsAdmin: (args: { roomCode: string }, cb: (err: SocketError, data: { users: User[] }) => void) => void;
  joinRoom: (args: { userName: string; roomCode: string }) => void;
  sendAnswer: (args: { userName: string; answer: string; roomCode: string }) => void;
  toggleAnswerCorrectnessServer: (args: { userName: string; roomCode: string }) => void;
  nextQuestionServer: (args: { roomCode: string; answerTime: number }) => void;
  endQuestionServer: (args: { roomCode: string }) => void;
  validateRoomCode: (args: { roomCode: string }, cb: (isValid: boolean) => void) => void;
}

export interface ServerToClientEvents {
  nextQuestion: (args: { endDate: string }) => void;
  answer: (answer: Answer) => void;
  setAnswerCorrectness: (args: { isCorrect: boolean }) => void;
  users: (users: User[]) => void;
  endQuestion: () => void;
}
