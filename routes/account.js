const express = require("express");
const router = express.Router();
const { getAccounts, getAccount, updateAccount, createAccount } = require('../controller/account')
// const { protect } = require("../middleware/auth")

router.route("/").post(createAccount).get(getAccounts)
router.route("/:id").put(updateAccount).get(getAccount)


module.exports = router;
