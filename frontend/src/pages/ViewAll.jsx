import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';

const ViewAll = () => {
    const [itineraries, setItineraries] = useState([]);
    const [activities, setActivities] = useState([]);
    const [museums, setMuseums] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itinerariesResponse = await axiosInstance.get('/api/itinerary');
                itinerariesResponse.data = itinerariesResponse.data.filter(itinerary => itinerary.flagged===false);
                itinerariesResponse.data = itinerariesResponse.data.filter(itinerary => itinerary.isActive);

                setItineraries(itinerariesResponse.data);

                const activitiesResponse = await axiosInstance.get('/api/activity');
                activitiesResponse.data = activitiesResponse.data.filter(activity => activity.bookingOpen);
                
                setActivities(activitiesResponse.data);

                const museumsResponse = await axiosInstance.get('/api/museum');
                setMuseums(museumsResponse.data);
            } catch (err) {
                setError('Failed to load data.');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <NavigateButton path={"/touristAccount"} text={"Back"} />{'\u00A0'}

            <NavigateButton path='/getActivities' text='Activities'/>{'\u00A0'}
            <NavigateButton path='/touristItineraries' text='Itineraries'/>{'\u00A0'}
            <NavigateButton path='/getMuseums' text='Museums'/>

            <h2>All Itineraries</h2>
            {itineraries.length > 0 ? (
                itineraries.map((itinerary) => (
                    <div key={itinerary._id}>
                        <strong>{itinerary.name}:</strong> {itinerary.tags.join(', ')}
                    </div>
                ))
            ) : (
                <div>Loading itineraries...</div>
            )}
            <h2>All Activities</h2>
            {activities.length > 0 ? (
                activities.map((activity) => (
                    <div key={activity._id}>
                        <strong>{activity.name}:</strong> {activity.tags.join(', ')}
                    </div>
                ))
            ) : (
                <div>Loading activities...</div>
            )}

            <h2>All Museums</h2>
            {museums.length > 0 ? (
                museums.map((museum) => (
                    <div key={museum._id}>
                        <strong>{museum.name}:</strong> {museum.description}
                    </div>
                ))
            ) : (
                <div>Loading museums...</div>
            )}

            {error && <div>{error}</div>}
        </div>
    );
};

export default ViewAll;