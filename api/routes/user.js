const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../../nodemon.env' });

const User_Controller = require('../controller/user')

router.post('/signup', User_Controller.create_user)

router.post('/Login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({ message: "Auth Failed" })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        res.status(401).json({ message: "Auth Failed" })
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                userId: user[0]._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: '1d'
                            }

                        )
                        res.status(200).json({ message: "Auth Successful", token })
                    } else {
                        res.status(401).json({ message: "Auth Failed" })
                    }
                })
            }
        })
        .catch(err =>
            res.status(500).json({
                error: err
            }))
})

router.delete('/delete/:userId', (req, res, next) => {
    let uid = req.params.userId;
    User.find({ _id: uid }).exec().then(doc => {
        console.log(doc.length)
        if (!doc.length) {
            res.status(404).json({
                message: "No User Found"
            })
        } else {
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

router.get('/allUser', (req, res, next) => {
    User.find().exec().then(doc => {
        if (doc.length >= 1) {
            res.status(200).json(doc)
        } else {
            res.status(404).json({ message: 'No User Account' })
        }
    })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})
module.exports = router;