const db = require('../config/db');

// Obtener citas
exports.getAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, p.name AS pet, c.name AS owner
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN clients c ON p.client_id = c.id
      ORDER BY a.appointment_date ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener citas' });
  }
};

// Crear cita
exports.createAppointment = async (req, res) => {
  const { pet_id, user_id, appointment_date, reason } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO appointments (pet_id, user_id, appointment_date, reason)
       VALUES (?, ?, ?, ?)`,
      [pet_id, user_id, appointment_date, reason]
    );

    res.status(201).json({ message: 'Cita creada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cita' });
  }
};