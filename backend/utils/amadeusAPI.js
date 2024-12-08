import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const AMADEUS_AUTH_URL =
  "https://test.api.amadeus.com/v1/security/oauth2/token";
const API_KEY = process.env.AMADEUS_API_KEY;
const API_SECRET = process.env.AMADEUS_API_SECRET;

let token = null;

const getAuthToken = async () => {
  if (token && token.expires_at > Date.now()) {
    return token.access_token;
  }

  try {
    const response = await axios.post(AMADEUS_AUTH_URL, {
      grant_type: "client_credentials",
      client_id: API_KEY,
      client_secret: API_SECRET,
    });

    token = {
      access_token: response.data.access_token,
      expires_at: Date.now() + response.data.expires_in * 1000,
    };

    return token.access_token;
  } catch (error) {
    console.error("Failed to get Amadeus token", error);
    throw error;
  }
};

module.exports = { getAuthToken };
