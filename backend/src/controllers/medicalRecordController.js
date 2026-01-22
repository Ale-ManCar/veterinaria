const db = require("../config/db");

// ===============================
// OBTENER HISTORIAL POR MASCOTA
// ===============================
exports.getRecordsByPet = async (req, res) => {
  const { petId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        mr.*, 
        u.name AS vet_name
      FROM medical_records mr
      JOIN users u ON mr.user_id = u.id
      WHERE mr.pet_id = ?
      ORDER BY mr.created_at DESC
      `,
      [petId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener historial clínico" });
  }
};

// ===============================
// CREAR HISTORIAL CLÍNICO
// ===============================
exports.createRecord = async (req, res) => {
  const { pet_id, visit_date, diagnosis, treatment } = req.body;
  const user_id = req.user.id; // 🔑 viene del token

  if (!pet_id || !visit_date) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO medical_records 
       (pet_id, user_id, visit_date, diagnosis, treatment)
       VALUES (?, ?, ?, ?, ?)`,
      [pet_id, user_id, visit_date, diagnosis, treatment]
    );

    res.status(201).json({
      message: "Historial clínico creado",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ ERROR INSERT MEDICAL:", error);
    res.status(500).json({ message: "Error al crear historial clínico" });
  }
};

// ===============================
// ELIMINAR HISTORIAL
// ===============================
exports.deleteRecord = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM medical_records WHERE id = ?", [id]);
    res.json({ message: "Historial eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar historial clínico" });
  }
};


// ==================================
// ✏️ ACTUALIZAR HISTORIAL CLÍNICO
// ==================================
exports.updateRecord = async (req, res) => {
  const { id } = req.params;
  const { visit_date, diagnosis, treatment } = req.body;

  if (!visit_date) {
    return res.status(400).json({ message: "La fecha es obligatoria" });
  }

  try {
    await db.query(
      `UPDATE medical_records 
       SET visit_date = ?, diagnosis = ?, treatment = ?
       WHERE id = ?`,
      [visit_date, diagnosis, treatment, id]
    );

    res.json({ message: "Historial actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar historial" });
  }
};