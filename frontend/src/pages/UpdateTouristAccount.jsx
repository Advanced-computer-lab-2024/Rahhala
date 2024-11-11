import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';

const UpdateTouristAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [profile, setProfile] = useState({
        email: '',
        mobileNumber: '',
        nationality: '',
        occupation: '',
        profilePicture: '',
        preferences: [],
        currency: ''
    }); // State to hold the tourist profile
    const [error, setError] = useState(null); // State to handle errors
    const [preferenceTags, setPreferenceTags] = useState([]); // State to hold available preference tags

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourist = async () => {
                try {
                    const response = await axiosInstance.get('/api/tourist/');
                    const { email, mobileNumber, nationality, occupation, profilePicture, preferences, currency } = response.data.profile;
                    setProfile({ email, mobileNumber, nationality, occupation, profilePicture, preferences, currency });
                } catch (err) {
                    setError('Failed to load tourist profile.');
                }
            };

            fetchTourist();
        }

        // Fetch preference tags
        const fetchPreferenceTags = async () => {
            try {
                const response = await axiosInstance.get('/api/preferenceTag');
                setPreferenceTags(response.data);
            } catch (err) {
                setError('Failed to load preference tags.');
            }
        };

        fetchPreferenceTags();
    }, [auth]);

    const handleCheckboxChange = (tagId) => {
        setProfile((prevProfile) => {
            const newPreferences = prevProfile.preferences.includes(tagId)
                ? prevProfile.preferences.filter((id) => id !== tagId)
                : [...prevProfile.preferences, tagId];
            return { ...prevProfile, preferences: newPreferences };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(profile)
            await axiosInstance.put(`/api/tourist/edit/${auth.user._id}`, profile);
            navigate('/viewTouristAccount');
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    return (
        <div>
            <h1>Update Tourist Account</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Mobile Number:
                    <input
                        type="text"
                        name="mobileNumber"
                        value={profile.mobileNumber}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Nationality:
                    <input
                        type="text"
                        name="nationality"
                        value={profile.nationality}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Occupation:
                    <input
                        type="text"
                        name="occupation"
                        value={profile.occupation}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Profile Picture:
                    <input
                        type="text"
                        name="profilePicture"
                        value={profile.profilePicture}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Currency:
                    <input
                        type="text"
                        name="currency"
                        value={profile.currency}
                        onChange={handleChange}
                    />
                </label>
                <fieldset>
                    <legend>Preferences</legend>
                    {preferenceTags.map((tag) => (
                        <label key={tag._id}>
                            <input
                                type="checkbox"
                                checked={profile.preferences.includes(tag._id)}
                                onChange={() => handleCheckboxChange(tag._id)}
                            />
                            {tag.name}
                        </label>
                    ))}
                </fieldset>
                <button type="submit">Update Profile</button>
            </form>
            <NavigateButton path={"/viewTouristAccount"} text={"Back"}/>{'\u00A0'}
        </div>
    );
};

export default UpdateTouristAccount;