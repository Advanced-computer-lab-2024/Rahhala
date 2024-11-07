// CurrencySelector.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencySelector = ({ onCurrencyChange }) => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default currency

  useEffect(() => {
    // Fetch available currencies from your backend
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('/api/currencies'); // Adjust the endpoint as necessary
        setCurrencies(response.data);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };
    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (event) => {
    const currency = event.target.value;
    setSelectedCurrency(currency);
    onCurrencyChange(currency); // Callback to parent component
  };

  return (
    <div>
      <label htmlFor="currency-select">Select Currency:</label>
      <select id="currency-select" value={selectedCurrency} onChange={handleCurrencyChange}>
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.name} ({currency.code})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
