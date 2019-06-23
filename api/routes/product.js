const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const Product = require('../models/product');
const Product_Controller = require('../controller/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/')
    },
    filename: function (req, file, cb) {
        var now = new Date().toISOString();
        now = now.replace(/:/g, "-");

        cb(null, now + file.originalname.toString());
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



router.get('/', Product_Controller.get_all_product)
router.post('/', checkAuth, upload.single('productImage'), Product_Controller.create_product)
router.get('/:productId', Product_Controller.get_single_product)

router.patch('/:productId', checkAuth, Product_Controller.update_single_product)

router.delete('/:productId', checkAuth, Product_Controller.delet_single_product)

module.exports = router;