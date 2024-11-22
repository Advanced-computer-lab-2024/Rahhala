import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header.js';

const Wallet = () => {
  const [walletBalance, setWalletBalance] = useState(250.0); 
  const [amountToAdd, setAmountToAdd] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleAddMoney = () => {
    const amount = parseFloat(amountToAdd);
    if (!isNaN(amount) && amount > 0) {
      setWalletBalance((prev) => prev + amount);
      setAmountToAdd('');
    } else {
      alert('Please enter a valid amount');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
      <button
        onClick={() => navigate(-1)}
        className="text-blue-500 mt-4 ml-4 flex items-center"
      >
        ← Back
      </button>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Wallet Balance</h1>
        <p className="text-xl text-center mb-4">${walletBalance.toFixed(2)}</p>
        <div className="space-y-4">
          <input
            type="number"
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
            placeholder="Enter amount to add"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddMoney}
            className="w-full py-2 bg-green-500 text-white rounded-md"
          >
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
