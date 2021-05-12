import { atom } from "recoil";

import { User } from "../../../shared/Types";

export enum Role {
  ADMIN = "ADMIN",
  PLAYER = "PLAYER",
}

interface Room {
  code: string;
  role: Role;
  users: User[];
  isConnected: boolean;
}

export const roomState = atom<Room | null>({
  key: "roomState",
  default: null,
});
