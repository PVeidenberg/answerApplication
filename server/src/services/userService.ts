import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name?: string;
}

export const userService = {
  createUserId(): string {
    return uuidv4();
  },
  createUser(): User {
    return {
      id: this.createUserId(),
    };
  },
};
