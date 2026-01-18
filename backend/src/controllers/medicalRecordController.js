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
    console.error(error);
    res.status(500).json({ message: "Error al obtener historial clínico" });
  }
};

// Crear historial
exports.createRecord = async (req, res) => {
  const { pet_id, diagnosis, treatment, visit_date } = req.body;
  const user_id = req.user.id; // viene del JWT

  if (!pet_id || !visit_date) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    await db.query(
      `INSERT INTO medical_records
       (pet_id, user_id, visit_date, diagnosis, treatment)
       VALUES (?, ?, ?, ?, ?)`,
      [pet_id, user_id, visit_date, diagnosis, treatment]
    );

    res.status(201).json({ message: "Historial clínico creado" });
  } catch (error) {
    console.error(error); // 🔥 ahora sí verás el error
    res.status(500).json({ message: "Error al crear historial clínico" });
  }
};