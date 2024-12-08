import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" }); // Adjust path if needed

const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const AMADEUS_FLIGHT_SEARCH_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
const AMADEUS_AIRPORT_SEARCH_URL = 'https://test.api.amadeus.com/v1/reference-data/locations';
const AMADEUS_FLIGHT_BOOKING_URL = 'https://test.api.amadeus.com/v1/booking/flight-orders';

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

// Ensure access token is available before making any API requests
const ensureAccessToken = async () => {
  if (!accessToken) {
    await getAccessToken();
  }
};

// Function to search for airports
const searchAirports = async (keyword) => {
  await ensureAccessToken();

  try {
    const response = await axios.get(
      `${AMADEUS_AIRPORT_SEARCH_URL}?subType=AIRPORT&keyword=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data; // List of airports matching the keyword
  } catch (error) {
    console.error('Error searching for airports:', error.response?.data || error.message);
    throw new Error('Failed to search for airports');
  }
};

// Function to search for flights
const searchFlights = async (origin, destination, departureDate) => {
  await ensureAccessToken();

  try {
    const response = await axios.get(
      `${AMADEUS_FLIGHT_SEARCH_URL}?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data; // List of flight offers
  } catch (error) {
    console.error('Error searching for flights:', error.response?.data || error.message);
    throw new Error('Failed to search for flights');
  }
};

// Function to book a flight
const bookFlight = async (flightOffer, travelerDetails) => {
  await ensureAccessToken();

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
          address: {
            lines: ["123 Main St"],
            postalCode: "12345",
            cityName: "Anytown",
            countryCode: "US"
          }
        },
      ],
    },
  };

  try {
    const response = await axios.post(
      AMADEUS_FLIGHT_BOOKING_URL,
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

// Example usage
(async () => {
  try {
    // 1. Search for airports (New York & Los Angeles)
    const originAirports = await searchAirports("New York");
    const destinationAirports = await searchAirports("Los Angeles");

    // Log the airport details
    console.log('Origin Airports:', originAirports);
    console.log('Destination Airports:', destinationAirports);

    const originCode = originAirports.data[0].iataCode; // Assuming first result is preferred
    const destinationCode = destinationAirports.data[0].iataCode; // Assuming first result is preferred

    // 2. Search for flights (JFK to LAX, departure on 2024-12-20)
    const flights = await searchFlights(originCode, destinationCode, "2024-12-20");
    console.log('Flights Found:', flights);

    // Assuming we pick the first flight
    const flightOffer = flights[0];

    // 3. Book the flight (using a simple traveler details structure)
    const travelerDetails = [
      {
        id: "1",
        dateOfBirth: "1982-01-16",
        name: {
          firstName: "John",
          lastName: "Doe",
        },
        gender: "MALE",
        contact: {
          emailAddress: "john.doe@example.com",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "1",
              number: "1234567890",
            },
          ],
        },
        documents: [
          {
            documentType: "PASSPORT",
            number: "123456789",
            expiryDate: "2025-12-31",
            issuanceCountry: "US",
            nationality: "US",
            holder: true,
          },
        ],
      },
    ];

    const bookingResponse = await bookFlight(flightOffer, travelerDetails);
    console.log('Booking successful:', bookingResponse);
  } catch (error) {
    console.error('Error during the flow:', error.message);
  }
})();
