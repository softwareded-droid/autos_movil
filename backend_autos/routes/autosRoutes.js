const express = require('express');
const router  = express.Router();
const autosController = require('../controllers/autosController');

// GET  /api/autos             → listar todos
router.get('/',            autosController.getAutos);

// GET  /api/autos/disponibles → solo disponibles
router.get('/disponibles', autosController.getAutosDisponibles);

// POST /api/autos             → registrar nuevo vehículo
router.post('/',           autosController.createAuto);

module.exports = router;
