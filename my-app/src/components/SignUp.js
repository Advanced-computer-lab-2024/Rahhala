import React, { useState } from 'react';
import signupImage from '../images/pexels-wanderer-731217.jpg';
import backgroundImage from '../images/pexels-codioful-7130504.jpg';

function Signup() {
  const [userType, setUserType] = useState('');
  const [occupation, setOccupation] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  return (
    <div
      className="h-screen overflow-y-auto bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="relative h-screen flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-black/50"
          style={{
            backdropFilter: 'blur(10px)',
            zIndex: -1,
          }}
        ></div>

        <div className="relative z-10">
          <h1 
            className="text-5xl font-bold text-white"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)' }}
          >
            Welcome to Rahhala
          </h1>
          <p 
            className="text-xl text-white mt-4"
            style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}
          >
            Scroll down to sign up
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg opacity-90">
          
          <div className="flex flex-col justify-center w-full p-8 md:w-1/2">
            <h2 className="text-3xl font-bold text-center text-gray-800">Sign Up</h2>
            <form className="mt-8 space-y-4">
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input 
                type="text" 
                placeholder="Mobile Number" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input 
                type="text" 
                placeholder="Nationality" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input 
                type="date" 
                placeholder="Date of Birth" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <select 
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select Occupation</option>
                <option value="job">Job</option>
                <option value="student">Student</option>
              </select>

              {occupation === 'job' && (
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Enter your Job Title"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              )}

              <select 
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select User Type</option>
                <option value="tourist">Tourist</option>
                <option value="tour_guide">Tour Guide</option>
                <option value="seller">Seller</option>
                <option value="advertiser">Advertiser</option>
                <option value="tourism_governor">Tourism Governor</option>
                <option value="admin">Admin</option>
              </select>
              <button 
                type="submit" 
                className="w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account? <a href="/login" className="text-blue-500">Login</a>
            </p>
          </div>

          <div className="hidden md:flex w-1/2">
            <img 
              src={signupImage} 
              alt="Signup" 
              className="object-cover w-full h-full rounded-r-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
