const express = require('express')
const { LoginAuthenticator } = require('../middlewares/auth')
const {addProducts, adminHome, editProduct, deleteProduct} = require('../controllers/admin')
const {upload} = require('../middlewares/imageUpload')
const { getOrders } = require('../controllers/orders')
const router = express.Router()

//user routes
router.get('/get-orders',LoginAuthenticator,getOrders)
router.post('/addProduct',LoginAuthenticator,upload.single('image'), addProducts);


router.get('/:id',adminHome)
router.put('/editProduct/:productId',LoginAuthenticator,upload.single('image'),editProduct);
router.delete('/delete/:productId',LoginAuthenticator,deleteProduct)


module.exports = router