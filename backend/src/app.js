const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

db.getConnection()
  .then(() => console.log('MySQL conectado correctamente'))
  .catch(err => console.error('Error MySQL:', err));

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Veterinaria funcionando' });
});

const clientRoutes = require('./routes/clientRoutes');
app.use('/api/clients', clientRoutes);

const petRoutes = require('./routes/petRoutes');
app.use('/api/pets', petRoutes);

const appointmentsRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentsRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

module.exports = app;
