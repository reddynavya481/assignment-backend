const Sequelize=require('sequelize')
const jwt = require('jsonwebtoken');
const models = require('../models')
const express = require('express');
const router = express.Router();

async function createUser (req, res,next) {
    try {
        const user = await models.User.create(req.body)
        res.status(200).json({user})
    }
    catch(error){
        res.status(404).json({error})
    }
}
async function createActivity (req, res,next) {
    try {
        const act = await models.Activity.create(req.body)
        res.status(200).json({act})
    }
    catch(error){
        res.status(404).json({error})
    }
}
async function getUserDetails (req, res, next) {
    const user = await models.User.findOne({
        where: {
            id: req.params.userId
        }
    })
    res.status(200).json(
        user
    )
}

function validateUser(req,res,next)
{
    models.User
      .findOne({
        where: {
          userName: req.body.userName,
        }
      })
      .then((user) => {
          console.log(user)
        if (!user) {
          return res.status(401).send({
            message: 'Authentication failed. User not found.',
          });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err) {
              if(user.logged){
                  res.status(200).send({success:true,msg:"already logged in !"})
              }
              else{
            var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 1});
            jwt.verify(token, 'nodeauthsecret', function(err, data){
              console.log(err, data);
            })
            res.json({success: true, token: 'JWT ' + token});
          } }else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        })
      })
      .catch((error) => res.status(400).send(error));
}

async function getUsers (req, res, next) {
    const user = await models.User.findAll({
    })
    res.status(200).json({
      user  
    })
}

async function getActivities (req, res, next) {
    const act = await models.Activity.findAll({
        attributes: ['activity','date','startTime','endTime','id']
    })
    res.status(200).json({
      act  
    })
}


module.exports = {
    createUser,
    getUsers,
    getUserDetails,
    validateUser,
    getActivities,
    createActivity,
}

