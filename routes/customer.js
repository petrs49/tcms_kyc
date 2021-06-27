const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, deleteCustomers, updateCustomer, getCustomer } = require('../controller/customer')
// const { protect } = require("../middleware/auth")

// const sales = require("./sales");
// const billingR = require("./billing")

// router.use("/:customerId/sales", sales);
// router.use("/:customerId/billing", billingR)


router.route('/').get(getCustomers ).post(createCustomer)
router.route('/:id').get(getCustomer).put( updateCustomer).delete(deleteCustomers)




module.exports = router