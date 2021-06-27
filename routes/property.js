const express = require("express");
const router = express.Router();
const { createProperty, getProperty, updateProperty, propertyImageUpload,
        propertyServicePointImage, getProperties } = require('../controller/property')
// const { createProperty, getProperty, updateProperty } = require('../controllers/property');
// const { protect } = require("../middleware/auth")


router.route("/:propertyId/photo").post(propertyImageUpload)
router.route("/:propertyId/sp-photo").post(propertyServicePointImage )

router.route("/").post(createProperty).get( getProperties)
router.route("/:id").put(updateProperty).get(getProperty)


module.exports = router;
