const express = require("express");
const router = express.Router();
const { getTransformer, getTransformers, updateTransformer, createTransformer,
         transformerImageUpload } = require('../controller/transformer')
// const { protect } = require("../middleware/auth")

router.route("/:codeId/photo").post(transformerImageUpload)

router.route("/").post(createTransformer).get(getTransformers)
router.route("/:id").put(updateTransformer).get(getTransformer)

 
module.exports = router;
