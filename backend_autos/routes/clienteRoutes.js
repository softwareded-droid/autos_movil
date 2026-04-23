const express = require('express');
const router  = express.Router();
const clienteController = require('../controllers/ClienteController');

// POST /api/clientes       → registrar cliente
router.post('/',       clienteController.registrarCliente);

// POST /api/clientes/login → login
router.post('/login',  clienteController.loginCliente);

// GET  /api/clientes       → ver todos
router.get('/',        clienteController.verclientes);

module.exports = router;
