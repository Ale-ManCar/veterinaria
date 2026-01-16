const db = require('../config/db');

// Obtener mascotas
exports.getPets = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pets.*, clients.name AS owner
      FROM pets
      JOIN clients ON pets.client_id = clients.id
      ORDER BY pets.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mascotas' });
  }
};

// Crear mascota
exports.createPet = async (req, res) => {
  const { client_id, name, species, breed, birth_date, sex } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO pets (client_id, name, species, breed, birth_date, sex)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [client_id, name, species, breed, birth_date, sex]
    );

    res.status(201).json({ message: 'Mascota creada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear mascota' });
  }
};