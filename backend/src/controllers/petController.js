const db = require("../config/db");

// ===============================
// OBTENER TODAS LAS MASCOTAS
// ===============================
exports.getPets = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pets");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener mascotas" });
  }
};

// ===============================
// OBTENER MASCOTAS POR CLIENTE
// ===============================
exports.getPetsByClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM pets WHERE client_id = ?",
      [clientId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener mascotas del cliente" });
  }
};

// ===============================
// CREAR MASCOTA
// ===============================
exports.createPet = async (req, res) => {
  console.log("📥 BODY RECIBIDO:", req.body);
  console.log("👤 USER:", req.user);

  const {
    name,
    species,
    breed,
    birth_date,
    sex,
    client_id,
  } = req.body;

  if (!name || !client_id) {
    return res.status(400).json({
      message: "name y client_id son obligatorios",
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO pets 
       (client_id, name, species, breed, birth_date, sex)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        client_id,
        name,
        species || null,
        breed || null,
        birth_date || null,
        sex || null,
      ]
    );

    res.status(201).json({
      message: "Mascota creada correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear mascota" });
  }
};

// ===============================
// ELIMINAR MASCOTA
// ===============================
exports.deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM pets WHERE id = ?", [id]);
    res.json({ message: "Mascota eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar mascota" });
  }
};