export interface User {
  name: string;
}

export interface Answer {
  userName: string;
  answer: string;
  date: string;
  isCorrect?: boolean;
}

export enum Role {
  ADMIN = "ADMIN",
  PLAYER = "PLAYER",
}

export interface SocketError {
  message: string;
}
