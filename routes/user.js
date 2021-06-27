const express = require("express");
const router = express.Router();
const {getUsers, createUser, getUser, loginUser, logout, getInstallers, 
    loginInstaller, createInstaller} = require("../controller/user");
// const { protect } = require("../middleware/auth")

router.get('/logout', logout)
router.route("/").get(getUsers).post(createUser)
router.post("/login", loginUser)
router.route("/:id").get(getUser);
router.get('/installer/:installerId', getInstallers)
router.post('/installer', createInstaller)
router.post('/installer/login', loginInstaller)



module.exports = router;