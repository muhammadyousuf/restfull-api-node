const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            res.status(409).json({
                message: 'email is already exsists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({ error: err })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'user created'
                        })
                    }).catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })

        }
    })

})

router.delete('/delete/:userId', (req, res, next) => {
    let uid = req.params.userId;
    User.find({_id:uid}).exec().then(doc => {
        console.log(doc.length)
        if(!doc.length){
        res.status(404).json({
            message:"No User Found"
        })
        }else{
            User.deleteOne({ _id: uid }).exec().then(() => {
                res.status(200).json({
                    message: 'user deleted Successfully'
                })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        }
    })
   
})
module.exports = router;