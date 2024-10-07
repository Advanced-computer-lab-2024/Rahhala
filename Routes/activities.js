const express= require('express')
const router =express.Router()

//Get all workouts
// router.get('/',(req,res)=>{
//     res.json({mssg:"Get all workouts"})
// })
//Get unique workouts
// router.get('/:id',(req,res)=>{
//     res.json({mssg:"Get a single workout"})
// }) 

// //Post a new workout 
// router.post('/',(req,res)=>{
//     res.json({mssg:"post a new workout"})
// })
// //Delete a workout
// router.delete('/:id',(req,res)=>{
//     res.json({mssg:"delete a new workout"})
// })
// //Update a workout
// router.patch('/:id',(req,res)=>{
//     res.json({mssg:"update a new workout"})
// })
//NEWWW
const activityService = require('../Services/activityService'); // Import service

// GET route to filter activities
router.get('/', async (req, res) => {
    try {
        const activities = await activityService.getFilteredActivities(req.query);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports=router
