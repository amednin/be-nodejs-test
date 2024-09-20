const express = require("express");
const router = express.Router();
const apiController = require("../controllers/ApiController");

router.get("/posts", apiController.getPosts);

module.exports = router;
