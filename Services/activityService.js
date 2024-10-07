const activities = [
    { name: "Hiking Trip", budget: 100, date: "2024-10-15", category: "Outdoor", ratings: 4.5 },
    { name: "Museum Tour", budget: 50, date: "2024-10-20", category: "Educational", ratings: 4.0 },
    { name: "City Walk", budget: 20, date: "2024-11-01", category: "Outdoor", ratings: 3.8 },
];

// Service to get filtered activities
function getFilteredActivities(query) {
    let filteredActivities = activities;

    if (query.budget) {
        filteredActivities = filteredActivities.filter(activity => activity.budget <= parseInt(query.budget));
    }
    if (query.date) {
        filteredActivities = filteredActivities.filter(activity => activity.date === query.date);
    }
    if (query.category) {
        filteredActivities = filteredActivities.filter(activity => activity.category.toLowerCase() === query.category.toLowerCase());
    }
    if (query.ratings) {
        filteredActivities = filteredActivities.filter(activity => activity.ratings >= parseFloat(query.ratings));
    }

    return filteredActivities;
}

module.exports = {
    getFilteredActivities
};
