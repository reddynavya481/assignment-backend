const Sequelize=require('sequelize')
const jwt = require('jsonwebtoken');
const models = require('../models')
const express = require('express');
const router = express.Router();

async function registerUser (req, res,next) {
    try {
        // const user = await models.User.create(req.body)
        const user=await models.User.findOne({
            where:{
                userName:req.body.userName
            }
        })
        if(user){
            res.status(400).json("user with this username already exists")
        }
        else{
            const user = await models.User.create(req.body)
        res.status(200).json({user})}
    }
    catch(error){
        res.status(404).json({error})
    }
}
// async function login(req,res,next){
//     try{

//     }
// }
async function createActivity (req, res,next) {
    try {
            const user = await models.User.findOne({
                where: {
                    userName: req.body.userName
                }
            })
            if(user)
{            const obj={...req.body,userId:user.id}
        const act = await models.Activity.create(obj)
        res.status(200).json({act})}}
    catch(error){
        res.status(404).json(error)
    }
}
// async function getUserDetails (req, res, next) {
//     const user = await models.User.findOne({
//         where: {
//             id: req.params.userId
//         }
//     })
//     res.status(200).json(
//         user
//     )
// }

async function loginUser(req,res,next)
{
    const user=await models.User
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
            var token = jwt.sign({userName:req.body.userName}, 'nodeauthsecret');
            // jwt.verify(token, 'nodeauthsecret', function(err, data){
            //   console.log(err, data);
            // })
            res.status(200).json({success: true, token: 'JWT ' + token});
          } }else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        })
      })
      .catch((error) => res.status(400).send(error));
}

// async function getUsers (req, res, next) {
//     const user = await models.User.findAll({
//     })
//     res.status(200).json({
//       user  
//     })
// }

// async function getActivities (req, res, next) {
//     const act = await models.Activity.findAll({
//         attributes: ['activity','date','startTime','endTime','id']
//     })
//     res.status(200).json({
//       act  
//     })
// }
async function signOut(req,res,next){
    const a=await models.User.update({'logged':false},{
        where:{
            userName:req.params.userName
        }
    })
    res.status(200).json("u are logged out")
}
async function getActivitiesByDate(req,res,next){
    try{
        // const token=req.headers['access-token']
        // const payload=jwt.decode(token)
        const user=await models.User.findOne({
            where:{
                userName:req.headers['userName']
            }
        })
        if(user){
        const data = await models.Activity.findAll({
            where: {
                userId:user.id,
                date:req.params.date,
            },
            attributes: ['activity','date','startTime','endTime','id','userId']
        })
        res.status(200).json({
            data
        })
    }}
    catch (error) {
        res.status(400).json({
            status: false,
            error,
            message:req.params.date
        })
    }
}


module.exports = {
    registerUser,
    // getUsers,
    // getUserDetails,
    // validateUser,
    // getActivities,
    createActivity,
    getActivitiesByDate,
    loginUser,
    signOut
}

