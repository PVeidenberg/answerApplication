export const api = {
  async getSession(): Promise<{ roomCode?: string }> {
    const response = await fetch("/api/session");

    return response.json();
  },
};
