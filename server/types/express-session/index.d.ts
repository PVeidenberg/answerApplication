import "express-session";
import { Role } from "../../../shared/Types";
import { User } from "../../src/services/userService";

declare module "express-session" {
  interface Session {
    roomCode?: string;
    role?: Role;
    user?: User;
  }
}
