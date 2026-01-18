const db = require('../config/db');

// Obtener mascotas por cliente
exports.getPetsByClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM pets WHERE client_id = ? ORDER BY id DESC`,
      [clientId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mascotas' });
  }
};

// Crear mascota (VERSIÓN CORREGIDA)
exports.createPet = async (req, res) => {
  const { client_id, name, species } = req.body;

  if (!client_id || !name || !species) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO pets (client_id, name, species)
       VALUES (?, ?, ?)`,
      [client_id, name, species]
    );

    res.status(201).json({
      message: 'Mascota creada',
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear mascota' });
  }
};