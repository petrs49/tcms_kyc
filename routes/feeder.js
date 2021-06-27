const express = require("express");
const router = express.Router();
const { feederImageUpload, getFeeders, getFeeder, createFeeder, updateFeeder
         } = require('../controller/feeder')
// const { protect } = require("../middleware/auth")


router.route("/:codeId/photo").post(feederImageUpload)

router.route("/").post(createFeeder).get( getFeeders)
router.route("/:id").put(updateFeeder).get(getFeeder)


module.exports = router;
