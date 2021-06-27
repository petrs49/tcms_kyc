const express = require("express");
const router = express.Router();
const { getMetering, getMeters, updateMetering, createMetering, createSchedule,
        beforeInstallationImageUpload, afterInstallationImageUpload
} = require('../controller/meter')

// const { protect } = require("../middleware/auth")

router.route("/:propertyId/photo").post(beforeInstallationImageUpload)
router.route("/:propertyId/sp-photo").post(afterInstallationImageUpload )

router.route('/schedule').post(createSchedule )
router.route("/").post(createMetering).get( getMeters)
router.route("/:id").put(updateMetering).get(getMetering)


module.exports = router;
