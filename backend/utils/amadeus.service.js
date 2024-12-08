import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: "../../.env" }); // Adjust path if needed

const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const AMADEUS_FLIGHT_SEARCH_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
const AMADEUS_AIRPORT_SEARCH_URL = 'https://test.api.amadeus.com/v1/reference-data/locations';


let accessToken = null;

// Function to get access token
const getAccessToken = async () => {
  try {
    const response = await axios.post(AMADEUS_AUTH_URL, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error fetching Amadeus access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Amadeus API');
  }
};

// Function to search flights
const searchFlights = async (origin, destination, departureDate) => {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const response = await axios.get(AMADEUS_FLIGHT_SEARCH_URL, {
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate,
        adults: 1,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching flight offers:', error.response?.data || error.message);
    throw new Error('Failed to fetch flight offers from Amadeus API');
  }
};

const searchAirportByCity = async (cityName) => {
    if (!accessToken) {
      await getAccessToken();
    }
  
    try {
      const response = await axios.get(AMADEUS_AIRPORT_SEARCH_URL, {
        params: {
          keyword: cityName,
          subType: 'CITY,AIRPORT',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data.map((location) => ({
        name: location.name,
        iataCode: location.iataCode,
      }));
    } catch (error) {
      console.error('Error searching for airports:', error.response?.data || error.message);
      throw new Error('Failed to fetch airports from Amadeus API');
    }
  };

  // Function to book a flight
  const bookFlight = async (flightOffer, travelerDetails) => {
    if (!accessToken) {
      await getAccessToken();
    }
  
    const bookingPayload = {
      data: {
        type: "flight-order",
        flightOffers: [flightOffer], // Use the selected flight offer from search
        travelers: travelerDetails, // Add traveler details here
        contacts: [
          {
            addresseeName: {
              firstName: "John",
              lastName: "Doe",
            },
            companyName: "Amadeus",
            purpose: "STANDARD",
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: "1",
                number: "1234567890",
              },
            ],
          },
        ],
      },
    };
  
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/booking/flight-orders',
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data; // Booking confirmation
    } catch (error) {
      console.error('Error booking flight:', error.response?.data || error.message);
      throw new Error('Failed to book flight');
    }
  };
  
  
  

export { getAccessToken, searchFlights, searchAirportByCity, bookFlight };
