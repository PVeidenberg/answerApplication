import { atom } from "recoil";

interface User {
  name?: string;
}

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
