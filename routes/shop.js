const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

const isAuth = require("../middleware/is-auth").isAuth1;




router.get('/', shopController.getIndex);
// // router.get("/orders",shopController.getOrders);
router.get("/products",shopController.getProducts);
router.get("/cart",isAuth,shopController.getCart);
router.post("/cart",isAuth,shopController.postCart);
router.post("/cart-delete-item",isAuth,shopController.postCartRemoveItem)
router.get("/products/:productId",shopController.getProduct);
// // router.get("/checkout",shopController.getCheckout);
router.get("/create-order",isAuth,shopController.getOrder);
router.post("/create-order",isAuth,shopController.postOrder);
router.get("/create-order/:orderId",isAuth,shopController.getInvoice)
module.exports = router;
