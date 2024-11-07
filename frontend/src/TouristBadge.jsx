// TouristBadge.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TouristBadge = () => {
  const [points, setPoints] = useState(0);
  const [badgeLevel, setBadgeLevel] = useState(1);

  // Determine level based on points
  const determineLevel = (points) => {
    if (points > 500000) return 3;
    else if (points > 100000) return 2;
    return 1;
  };

  // Fetch loyalty points from the backend
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get('/api/tourist/points'); // Backend route to fetch points
        const fetchedPoints = response.data.points;
        setPoints(fetchedPoints);
        setBadgeLevel(determineLevel(fetchedPoints));
      } catch (error) {
        console.error('Error fetching loyalty points:', error);
      }
    };

    fetchPoints();
  }, []);

  return (
    <div>
      <h2>Your Badge</h2>
      <p>Total Points: {points}</p>
      <p>Level: {badgeLevel}</p>
      <div className="badge">
        {badgeLevel === 1 && <span className="badge-level-1">Level 1 Badge</span>}
        {badgeLevel === 2 && <span className="badge-level-2">Level 2 Badge</span>}
        {badgeLevel === 3 && <span className="badge-level-3">Level 3 Badge</span>}
      </div>
    </div>
  );
};

export default TouristBadge;
