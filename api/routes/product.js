const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find().sort({name:1})
    .exec()
    .then(docs => {
      console.log("Get all Documents ", docs);
      if(docs.length >= 0){
        res.status(200).json(docs);
      }else{
        res.status(404).json({
            message:'no entries found'
        });
      }
     
    })
    .catch(err => {
        console.log('error ', err);
        res.status(500).json({
            error:err
        });
    })
})
router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then(result => {
            console.log('result', result);
            res.status(200).json({
                message: 'add product',
                product: result
            })
        }).catch(err => {
            console.log("error", err);
            res.status(500).json({ error: err })

        })

})
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec().then(doc => {
        console.log("Form Database", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ message: 'No Valid Entry For Provided ID ' });
        }

    }).catch(err => {
        console.log('error', err);
        res.status(500).json({ error: err })
    })


    // console.log(id)
    // if (id === "special") {
    //     res.status(200).json({
    //         message: 'get product by  Special ID',
    //         id: id
    //     })
    // } else {
    //     res.status(200).json({
    //         message: 'get product by ID',
    //     })
    // }

})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated Product By ID'
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id:id}).exec().then(result => {
        res.status(200).json(result)
    }).catch(err => {
        console.log('error',err);
        res.status(500).json({error:err})
    })
})

module.exports = router;