const express = require("express");
const { 
  createCustomProduct, 
  updateCustomProduct, 
  getCustomProductById, 
  getAllCustomProducts, 
  deleteCustomProduct 
} = require("../controllers/customProductController");
const protect = require("../../middlewares/protect"); 
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/", protect, upload.array("images", 5), createCustomProduct);

router.put("/:productId", protect, upload.array("images", 5), updateCustomProduct);

router.get("/:productId", getCustomProductById);

router.get("/", getAllCustomProducts);

router.delete("/:productId", protect, deleteCustomProduct);

module.exports = router;
