import { SessionApi } from "../../../shared/Api";

export const api = {
  async getSession(): Promise<SessionApi> {
    const response = await fetch("/api/session");

    return response.json();
  },
};
