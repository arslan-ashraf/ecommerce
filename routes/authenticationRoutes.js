const express = require('express')
const userControllers = require('../controllers/userControllers')

const router = express.Router()

router.get('/register', userControllers.register)
router.get('/sign-in', userControllers.sign_in)
router.post('/register', userControllers.register_post)
router.post('/login', userControllers.login_post)
router.get('/cart', userControllers.cart)
router.get('/profile', userControllers.profile)
router.post('/products/:category/:title/add-to-cart', userControllers.add_to_cart)
router.delete('/remove-from-cart', userControllers.remove_from_cart)
router.post('/add-to-cart', userControllers.add_more_to_cart)
router.get('/logout', userControllers.logout)
router.get('/checkout', userControllers.checkout)

module.exports = { router }