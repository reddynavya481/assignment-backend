const express = require('express');
const router = express.Router();

const {
    registerUser,getUserDetails,getUsers,createActivity,getActivitiesByDate,loginUser,signOut
} = require('./Handler')
// router.get('/users', getUsers)
// router.get('/users/:userId', getUserDetails)
router.post('/register', registerUser)
router.post('/addactivity', createActivity)
// router.get('/activity',getActivities)
// router.get('/validate',validateUser)
router.post('/login',loginUser)
router.post('/getact/:date',getActivitiesByDate)
router.put('/signout',signOut)
module.exports = router;