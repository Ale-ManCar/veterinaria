const db = require("../config/db");

// Obtener historial por mascota
exports.getRecordsByPet = async (req, res) => {
  const { petId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM medical_records WHERE pet_id = ? ORDER BY created_at DESC",
      [petId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial clínico" });
  }
};

// Crear historial
exports.createRecord = async (req, res) => {
  const { pet_id, reason, diagnosis, treatment, notes } = req.body;

  if (!pet_id || !reason) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO medical_records 
       (pet_id, reason, diagnosis, treatment, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [pet_id, reason, diagnosis, treatment, notes]
    );

    res.status(201).json({
      message: "Historial clínico creado",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear historial clínico" });
  }
};