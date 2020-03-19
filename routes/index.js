const express = require('express');
const router = express.Router();

const {
    createUser,getUserDetails,getUsers,validateUser,createActivity,getActivities
} = require('./Handler')
router.get('/users', getUsers)
router.get('/users/:userId', getUserDetails)
router.post('/users', createUser)
router.post('/activity', createActivity)
router.get('/activity',getActivities)
router.get('/validate',validateUser)
module.exports = router;