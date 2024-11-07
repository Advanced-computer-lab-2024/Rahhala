// LoyaltyPoints.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LoyaltyPoints = ({ touristLevel }) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [pointsEarned, setPointsEarned] = useState(null);

  const calculateLoyaltyPoints = () => {
    let multiplier = 0.5; // Default multiplier for level 1
    if (touristLevel === 2) multiplier = 1;
    else if (touristLevel === 3) multiplier = 1.5;
    
    return amountPaid * multiplier;
  };

  const handlePayment = async () => {
    const points = calculateLoyaltyPoints();
    try {
      const response = await axios.post('/api/process-payment', {
        amount: amountPaid,
        points: points,
      });
      setPointsEarned(points);
      console.log('Payment processed and points awarded:', response.data);
    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <h2>Earn Loyalty Points</h2>
      <div>
        <label htmlFor="amountPaid">Amount Paid:</label>
        <input
          type="number"
          id="amountPaid"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          required
        />
      </div>
      <button onClick={handlePayment}>Process Payment & Earn Points</button>

      {pointsEarned !== null && (
        <div>
          <h3>Points Earned: {pointsEarned}</h3>
        </div>
      )}
    </div>
  );
};

export default LoyaltyPoints;
