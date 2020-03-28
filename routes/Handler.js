// import { Op } from 'sequelize/types';
const moment=require('moment')
const Sequelize=require('sequelize')
const jwt = require('jsonwebtoken');
const models = require('../models')
const express = require('express');
const router = express.Router();
moment.suppressDeprecationWarnings = true
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


async function getRecord(req,res,next){
    try {
        // const result;
        let prevDates = [];
        let info = {}
        let output = []
        const user = await models.User.findOne({
            where: {
                userName: req.body.userName
            }
        })
        // console.log(user)
        for (let i = 0; i < 7; i++) {
            let date = new Date();
            let prevdate = date.getDate() - i;
            date.setDate(prevdate)
            let nowDate =`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            // nowDate=moment(nowDate)
            prevDates.push(nowDate)
        }

        for (i = 0; i < 7; i++) {
            let sum = 0;
            let obj = [];
            let c=0;

            const data = await models.Activity.findAll({
                where: {
                    userId: user.id,
                    date: prevDates[i]
                }
            })
            console.log(prevDates[i])
            obj = [...JSON.parse(JSON.stringify(data, null, 4))]
            if (obj.length !== 0) {
                obj.map(act => {
                    if (act.endTime !== null)
                    {
                        c++
                        sum = sum + moment(act.endTime, "HH:mm:ss").diff(moment(act.startTime, "HH:mm:ss"))
                    }
                })
                info = {
                    date: prevDates[i], count: c, duration: sum/60000+"mins"
                }
                output.push(info)
                
            }
            else {
                info = {
                    date: prevDates[i], count: 0, duration: 0
                }
                output.push(info)
            }
        }
        res.status(200).json({
            output
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error
        })
    }
}


async function loginUser(req,res,next)
{
    const user=await models.User
      .findOne({
        where: {
          userName: req.body.userName,
        }
      })
      .then((user) => {
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

async function getActivities (req, res, next) {
    try{
    const user=await models.User
      .findOne({
        where: {
          userName: req.body.userName,
        }
      })
    const act = await models.Activity.findAll({
        where:{
            userId:user.id
        }
    })
    res.status(200).json({
      act  
    })
}
catch(error){
    res.status(400).json({
        error
    })
}
}
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
                userName:req.body.userName
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
    getActivities,
    getRecord,
    createActivity,
    getActivitiesByDate,
    loginUser,
    signOut
}

