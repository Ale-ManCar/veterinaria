const db = require('../config/db');

// Obtener todos los clientes
exports.getClients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

// Crear cliente
exports.createClient = async (req, res) => {
  const { name, phone, email, address, notes } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO clients (name, phone, email, address, notes) VALUES (?, ?, ?, ?, ?)',
      [name, phone, email, address, notes]
    );

    res.status(201).json({ message: 'Cliente creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

// Eliminar cliente
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
};