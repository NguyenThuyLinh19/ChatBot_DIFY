const express = require("express");
const router = express.Router();
const difyController = require("../controllers/dify.controller");

router.post("/add", difyController.addChunk);

module.exports = router;
