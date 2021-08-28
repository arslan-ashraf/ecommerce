const express = require('express')
const productControllers = require('../controllers/productControllers')

const router = express.Router()

router.get('/products/:category', productControllers.all_products_in_category)
router.get('/products/:category/:title/:id', productControllers.get_a_product)

module.exports = { router }