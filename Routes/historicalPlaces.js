const express = require('express');
const router = express.Router();

// Sample data for historical places
const historicalPlaces = [
    { name: "The Great Pyramids", location: "Giza", tag: "Ancient" },
    { name: "The Egyptian Museum", location: "Cairo", tag: "Museum" },
    { name: "Luxor Temple", location: "Luxor", tag: "Ancient" },
    { name: "Alexandria Library", location: "Alexandria", tag: "Modern" },
];

// Route to filter historical places by tag
router.get('/', (req, res) => {
    const tag = req.query.tag;
    let filteredPlaces = historicalPlaces;

    if (tag) {
        filteredPlaces = filteredPlaces.filter(place => 
            place.tag.toLowerCase() === tag.toLowerCase()
        );
    }

    res.json(filteredPlaces);
});

module.exports = router;
