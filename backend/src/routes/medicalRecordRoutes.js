const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicalRecordController");
const auth = require("../middleware/authMiddleware");

router.get("/pets/:petId", auth, controller.getRecordsByPet);
router.post("/", auth, controller.createRecord);
router.delete("/:id", auth, controller.deleteRecord);

module.exports = router;