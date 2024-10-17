import axios from "axios";

export async function fetchFromHuggingFace(userMessage) {
  try {
    const response = await axios.post(
      process.env.HUGGING_FACE_API_URL,
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = toString(response.data);
    console.log(response.data);
    return response.data; // Return the model's response
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || "An error occurred"; // Fallback message

      // Check for specific error messages
      if (errorMessage.includes("specific error message")) {
        return {
          status: status,
          message: "Here's a different response for that error.",
        };
      }

      // Handle other status codes
      switch (status) {
        case 400:
          return {
            status: 400,
            message:
              "I'm sorry, but your message seems to be malformed. Please check and try again.",
          };
        case 401:
          return {
            status: 401,
            message:
              "I can't access the service right now. Please check my settings.",
          };
        case 404:
          return {
            status: 404,
            message:
              "It seems that the model I'm trying to reach is not available at the moment.",
          };
        case 429:
          return {
            status: 429,
            message:
              "I'm sorry, but I've hit a limit on requests. Please try again in a moment.",
          };
        case 500:
          return {
            status: 500,
            message:
              "There seems to be an issue on my end. Please try again later.",
          };
        default:
          return {
            status: 500,
            message: "An unexpected error occurred. Please try again later.",
          };
      }
    } else {
      // Handle network errors or timeouts
      console.error("Network error:", error.message);
      return {
        status: 503,
        message:
          "I'm currently having trouble reaching the server. Please try again later.",
      };
    }
  }
}


