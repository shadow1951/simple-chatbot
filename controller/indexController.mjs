import { message } from "./startMessage.mjs";
import { fetchFromHuggingFace, run } from "../fetch/llamaFetch.mjs";
import axios from "axios";
export const start = async (req, res) => {
  res.status(200).send(message);
};

export const chat = async (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({
      message: "Request body cannot be empty. Please provide valid data.",
    });
  }

  const prompt = req.body.message; // Use this as your prompt

  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${process.env.model}`,
      { prompt }, // Send the prompt as the request body
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response structure is valid
    if (
      response.data &&
      response.data.result &&
      response.data.result.response
    ) {
      // Extract the response message
      const responseMessage = response.data.result.response;
      return res.json({ response: responseMessage });
    } else {
      // Handle case where response structure is not as expected
      return res.status(500).json({
        error: "Unexpected response structure from the API.",
      });
    }
  } catch (error) {
    console.error(
      "Error calling Cloudflare API:",
      error.response?.data || error.message || error
    );

    // Check for specific error responses from the Cloudflare API
    if (error.response) {
      const { status, data } = error.response;
      return res.status(status).json({
        error: data?.error?.message || "Error from Cloudflare API.",
      });
    }

    // Handle other types of errors
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};
