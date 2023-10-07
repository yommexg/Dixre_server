const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const multer = require("multer");

const upload = multer({ dest: "postImg/" });

router.get("/", postsController.getAllPosts);

router.post(
  "/new",
  upload.array("postImages", 6),
  postsController.handleNewPost
);
module.exports = router;
