const express = require('express');
const router  = express.Router();
const alquilerController = require('../controllers/alquilerController');

// POST /api/alquiler                        → crear alquiler
router.post('/',                         alquilerController.realizarAlquiler);

// GET  /api/alquiler/historial              → historial completo
router.get('/historial',                 alquilerController.historial);

// GET  /api/alquiler/cliente/:clienteId     → alquileres de un cliente
router.get('/cliente/:clienteId',        alquilerController.alquileresPorCliente);

// PUT  /api/alquiler/devolver/:alquilerId   → devolver vehículo
router.put('/devolver/:alquilerId',      alquilerController.devolverVehiculo);

module.exports = router;
