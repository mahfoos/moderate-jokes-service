import axios from "axios";
import { Joke } from "../types";
import dotenv from "dotenv";
dotenv.config();

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
    jokeId: string,
    updatedJoke: Partial<Joke>
  ): Promise<boolean> {
    try {
      console.log("Attempting to approve joke:", {
        jokeId,
        updatedJoke,
        deliverUrl: `${this.deliverJokesUrl}/jokes`,
        submitUrl: `${this.submitJokesUrl}/jokes/${jokeId}`,
      });

      // Step 1: Add to deliver jokes service
      try {
        await axios.post(`${this.deliverJokesUrl}/jokes`, updatedJoke);
        console.log("Successfully added to deliver service");
      } catch (error) {
        console.error("Failed to add to deliver service:", error);
        throw new Error("Failed to add to deliver service");
      }

      // Step 2: Delete from submit jokes service
      try {
        await axios.delete(`${this.submitJokesUrl}/jokes/${jokeId}`);
        console.log("Successfully deleted from submit service");
      } catch (error) {
        console.error("Failed to delete from submit service:", error);
        // You might want to handle this case specially
        // as the joke is already in the deliver service
        throw new Error("Failed to delete from submit service");
      }

      return true;
    } catch (error) {
      console.error("Error approving joke:", error);
      return false;
    }
  }

  async rejectJoke(jokeId: string): Promise<boolean> {
    try {
      if (!jokeId) {
        throw new Error("Joke ID is required");
      }

      const response = await axios.delete(
        `${this.submitJokesUrl}/jokes/${jokeId}`
      );

      return response.status === 200 || response.status === 204;
    } catch (error) {
      console.error("Error rejecting joke:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Joke not found");
        }
      }
      throw error;
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
