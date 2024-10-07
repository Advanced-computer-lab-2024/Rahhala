const activityService = require('../Services/activityService');

// Controller to handle filtering logic
async function filterActivities(req, res) {
    try {
        const activities = await activityService.getFilteredActivities(req.query);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {  
    filterActivities
};
