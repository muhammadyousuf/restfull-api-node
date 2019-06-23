const Product = require('../models/product');



exports.get_all_product = (req, res, next) => {
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
}

exports.get_single_product =  (req, res, next) => {
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
}