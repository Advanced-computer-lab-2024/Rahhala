// RedeemPoints.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RedeemPoints = () => {
  const [points, setPoints] = useState(0);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [cashValue, setCashValue] = useState(0);
  const [message, setMessage] = useState('');

  const POINTS_TO_CASH_RATIO = 10000; // 10000 points = 100 EGP

  // Fetch current points balance
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get('/api/tourist/points'); // Backend route to fetch points
        setPoints(response.data.points);
      } catch (error) {
        console.error('Error fetching points:', error);
      }
    };

    fetchPoints();
  }, []);

  // Calculate cash value based on input
  const handleRedeemAmountChange = (e) => {
    const amount = e.target.value;
    setRedeemAmount(amount);
    setCashValue((amount / POINTS_TO_CASH_RATIO) * 100); // Convert to EGP
  };

  // Handle redeem points action
  const handleRedeem = async () => {
    if (redeemAmount > points) {
      setMessage('You do not have enough points to redeem this amount.');
      return;
    }

    try {
      const response = await axios.post('/api/tourist/redeem', {
        pointsToRedeem: redeemAmount,
      });

      if (response.data.success) {
        setPoints(points - redeemAmount); // Update points balance locally
        setMessage(`Successfully redeemed! You received ${cashValue} EGP in your wallet.`);
      } else {
        setMessage('Redemption failed. Please try again later.');
      }
    } catch (error) {
      console.error('Error redeeming points:', error);
      setMessage('Error redeeming points. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Redeem Points</h2>
      <p>Current Points: {points}</p>
      <div>
        <label>Points to Redeem:</label>
        <input
          type="number"
          value={redeemAmount}
          onChange={handleRedeemAmountChange}
          placeholder="Enter points to redeem"
        />
      </div>
      <p>Cash Value: {cashValue} EGP</p>
      <button onClick={handleRedeem} disabled={!redeemAmount || redeemAmount > points}>
        Redeem Points
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RedeemPoints;
