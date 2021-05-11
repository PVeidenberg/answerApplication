import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  name?: string;
}

export const userService = {
  createUser(name?: string): User {
    return {
      id: uuidv4(),
      name,
    };
  },
};
