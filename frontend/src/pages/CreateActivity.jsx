import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const CreateActivity = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        location: [0, 0],
        price: '',
        category: '',
        tags: '',
        specialDiscounts: '',
        bookingOpen: false,
        rating: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'locationLat' || name === 'locationLng') {
            const newLocation = [...formData.location];
            if (name === 'locationLat') newLocation[0] = parseFloat(value);
            if (name === 'locationLng') newLocation[1] = parseFloat(value);
            setFormData({ ...formData, location: newLocation });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/activity/', formData);
            navigate("/advertiser-dashboard");
        } catch (error) {
            alert('An error occurred while creating the activity.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <br/><input type="date" name="date" placeholder="Date" value={formData.date} onChange={handleChange} required />
                <br/><input type="time" name="time" placeholder="Time" value={formData.time} onChange={handleChange} required />
                <br/><input type="number" name="locationLat" placeholder="Latitude" value={formData.location[0]} onChange={handleChange} required min="0" />
                <br/><input type="number" name="locationLng" placeholder="Longitude" value={formData.location[1]} onChange={handleChange} required min="0" />
                <br/><input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required min="0" />
                <br/><input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                <br/><input type="text" name="tags" placeholder="Tags" value={formData.tags} onChange={handleChange} />
                <br/><input type="text" name="specialDiscounts" placeholder="Special Discounts" value={formData.specialDiscounts} onChange={handleChange} />
                <br/><input type="checkbox" name="bookingOpen" checked={formData.bookingOpen} onChange={(e) => setFormData({ ...formData, bookingOpen: e.target.checked })} />
                <br/><input type="number" name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} min="0" max="5" />
                <br/><button type="submit">Create Activity</button>
            </form>
            <NavigateButton path={"/advertiser-dashboard"} text={"Home"} />
        </div>
    );
};

export default CreateActivity;