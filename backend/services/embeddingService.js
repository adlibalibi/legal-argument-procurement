import axios from "axios";

/**
 * Request embedding from embedding service (Python or remote)
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function getQueryEmbedding(text) {
  try {
    const response = await axios.post("http://127.0.0.1:5001/embed", { text });
    return response?.data?.embedding;
  } catch (err) {
    console.error("Error fetching embedding:", err);
    throw err;
  }
}