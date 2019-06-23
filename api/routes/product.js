const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/')
    },
    filename: function (req, file, cb) {
        var now = new Date().toISOString();
        now = now.replace(/:/g, "-");
        
        cb(null, now +  file.originalname.toString());
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
const Product_Controller = require('../controller/product');

router.get('/', Product_Controller.get_all_product)
router.post('/' , checkAuth, upload.single('productImage') ,  (req, res, next) => {
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
router.get('/:productId', Product_Controller.get_single_product)

router.patch('/:productId', checkAuth, (req, res, next) => {
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

router.delete('/:productId', checkAuth, (req, res, next) => {
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