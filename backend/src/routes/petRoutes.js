const express = require("express");
const router = express.Router();

const petController = require("../controllers/petController");
const auth = require("../middleware/authMiddleware");

// 🔹 Obtener todas las mascotas
router.get("/", auth, petController.getPets);

// 🔹 Obtener mascotas por cliente
router.get("/clients/:clientId", auth, petController.getPetsByClient);

// 🔹 Crear mascota
router.post("/", auth, petController.createPet);

// 🔹 Eliminar mascota
router.delete("/:id", auth, petController.deletePet);

module.exports = router;