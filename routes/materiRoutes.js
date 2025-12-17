const express = require("express");
const router = express.Router();
const materiController = require("../controllers/materiController");

router.get("/", materiController.getMateri);

module.exports = router;
