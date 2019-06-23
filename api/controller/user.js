const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../../nodemon.env' });

exports.create_user = (req, res, next) => {
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
}

exports.User_Login =  (req, res, next) => {
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
}


exports.User_Delete = (req, res, next) => {
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
}

exports.list_all_users =  (req, res, next) => {
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
}