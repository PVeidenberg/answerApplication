import "express-session";
import { Session } from "express-session";

declare module "http" {
  interface IncomingMessage {
    session: Session;
  }
}
