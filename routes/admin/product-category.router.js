const express = require("express");
const multer = require("multer");
const router = express.Router();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();

const validate = require("../../validates/admin/product-category.validate");
const controller = require("../../controllers/admin/product-category.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);

module.exports = router;
