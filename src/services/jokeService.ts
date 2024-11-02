import axios from "axios";
import { Joke } from "../types";

export class JokeService {
  private deliverJokesUrl: string;
  private submitJokesUrl: string;

  constructor() {
    this.deliverJokesUrl = process.env.DELIVER_JOKES_URL!;
    this.submitJokesUrl = process.env.SUBMIT_JOKES_URL!;
  }

  async getUnmoderatedJoke(): Promise<Joke | null> {
    try {
      const response = await axios.get(
        `${this.submitJokesUrl}/jokes/unmoderated`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching unmoderated joke:", error);
      return null;
    }
  }

  async approveJoke(
    jokeId: number,
    updatedJoke: Partial<Joke>
  ): Promise<boolean> {
    try {
      // Add to deliver jokes service
      await axios.post(`${this.deliverJokesUrl}/jokes`, updatedJoke);

      // Delete from submit jokes service
      await axios.delete(`${this.submitJokesUrl}/jokes/${jokeId}`);

      return true;
    } catch (error) {
      console.error("Error approving joke:", error);
      return false;
    }
  }

  async rejectJoke(jokeId: number): Promise<boolean> {
    try {
      await axios.delete(`${this.submitJokesUrl}/jokes/${jokeId}`);
      return true;
    } catch (error) {
      console.error("Error rejecting joke:", error);
      return false;
    }
  }

  async getJokeTypes(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.deliverJokesUrl}/jokes/types`);
      return response.data;
    } catch (error) {
      console.error("Error fetching joke types:", error);
      return [];
    }
  }
}
