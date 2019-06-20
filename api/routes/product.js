const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }


}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find().sort({ name: 1 })
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            console.log("Get all Documents ", docs);

            if (docs.length >= 0) {
                const response = {
                    count: docs.length,
                    product: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            productImage: doc.productImage,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:5000/product/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'no entries found'
                });
            }

        })
        .catch(err => {
            console.log('error ', err);
            res.status(500).json({
                error: err
            });
        })
})
router.post('/', upload.single('uploadImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path
    })
    product.save()
        .then(result => {
            console.log('result', result);
            res.status(200).json({
                message: 'Product Created SuccessFully',
                product: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/product/' + result._id
                    }
                }
            })
        }).catch(err => {
            console.log("error", err);
            res.status(500).json({ error: err })

        })

})
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select("name price _id productImage").exec().then(doc => {
        console.log("Form Database", doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/product'
                }
            });
        } else {
            res.status(404).json({ message: 'No Valid Entry For Provided ID ' });
        }

    }).catch(err => {
        console.log('error', err);
        res.status(500).json({ error: err })
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOpt = {};
    for (const opt of req.body) {
        updateOpt[opt.Propname] = opt.value;
    }
    Product.update({ _id: id }, { $set: updateOpt }).exec().then(result => {
        console.log('update', result);
        res.status(200).json({
            message: 'Update Record Successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:5000/product/' + id
            }
        });
    }).catch(err => {
        console.log('error', err);
        res.status(500).json({ error: err })
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'Deleted Product SuccessFully',
            request: {
                type: 'POST',
                url: 'http://localhost:5000/product',
                body: { name: 'String', price: 'Number' }
            }
        })
    }).catch(err => {
        console.log('error', err);
        res.status(500).json({ error: err })
    })
})

module.exports = router;