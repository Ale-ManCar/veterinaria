const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const auth = require('../middleware/authMiddleware');

router.get('/clients/:clientId', auth, petController.getPetsByClient);
router.post('/', auth, petController.createPet);

module.exports = router;