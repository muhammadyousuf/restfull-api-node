const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get all products'
    })
})
router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'add product'
    })
})
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    console.log(id)
    if (id === "special") {
        res.status(200).json({
            message: 'get product by  Special ID',
            id: id
        })
    } else {
        res.status(200).json({
            message: 'get product by ID',
        })
    }

})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated Product By ID'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Delete Product By ID'
    })
})

module.exports = router;