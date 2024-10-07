require('dotenv').config()
const express = require('express');
const app = express();
const activityRoutes = require('../Routes/activities');

// const workoutRoutes = require('./Routes/Workout')

//middleware
app.use(express.json())



// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.path}`);
    next();
});

// Use the activities route
app.use('/api/activities', activityRoutes);

const historicalPlacesRoutes = require('../Routes/historicalPlaces');

// Use historical places routes
app.use('/api/historical-places', historicalPlacesRoutes);

app.get('/api/view-all', (req, res) => {
    res.json({Activitiy ,Museum , itineraries});
});

// Listen for requests
const PORT = 4000;
app.listen(PORT, () => {    
    console.log(`Server running on port ${PORT}`);
});
