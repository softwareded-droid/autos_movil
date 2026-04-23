const { Cliente } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// hay que ejecutar el comando npm install jsonwebtoken y crear la variable de entorno JWT_SECRET

const clienteController = {
    // Método para registrar un nuevo cliente
    async registrarCliente(req, res) {
        try {
            const { nombre, correo, numLic, password } = req.body;

            // Validar que se proporcionen todos los campos requeridos
            if (!nombre || !correo || !numLic || !password) {
                return res.status(400).json({
                    error: 'Todos los campos son obligatorios'
                });
            }

            // Verificar si ya existe un cliente con el mismo correo
            const clienteExistente = await Cliente.findOne({ where: { correo } });
            if (clienteExistente) {
                return res.status(400).json({
                    error: 'Ya existe un cliente registrado con este correo'
                });
            }

            // Crear el nuevo cliente
            // No necesitamos encriptar la contraseña aquí porque ya lo hace el hook beforeCreate
            const nuevoCliente = await Cliente.create({
                nombre,
                correo,
                numLic,
                password
            });

            // Evitar enviar la contraseña en la respuesta
            const clienteResponse = {
                id: nuevoCliente.id,
                nombre: nuevoCliente.nombre,
                correo: nuevoCliente.correo,
                numLic: nuevoCliente.numLic
            };

            res.status(201).json({
                mensaje: 'Cliente registrado exitosamente',
                cliente: clienteResponse
            });

        } catch (error) {
            console.error('Error al registrar cliente:', error);
            res.status(500).json({
                error: 'Error al registrar el cliente'
            });
        }
    },

    // Método para login de cliente
    async loginCliente(req, res) {
        try {
            const { correo, password } = req.body;

            // Validar que se proporcionen los campos necesarios
            if (!correo || !password) {
                return res.status(400).json({
                    error: 'Correo y contraseña son requeridos'
                });
            }

            // Buscar el cliente por correo
            const cliente = await Cliente.findOne({ where: { correo } });
            if (!cliente) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Verificar la contraseña
            const passwordValida = await bcrypt.compare(password, cliente.password);
            if (!passwordValida) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: cliente.id,
                    correo: cliente.correo 
                },
                process.env.JWT_SECRET || 'tu_clave_secreta',
                { expiresIn: '24h' }
            );

            res.json({
                mensaje: 'Login exitoso',
                token,
                cliente: {
                    id: cliente.id,
                    nombre: cliente.nombre,
                    correo: cliente.correo,
                    numLic: cliente.numLic
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                error: 'Error al iniciar sesión'
            });
        }
    },

    // Método para ver todos los clientes
    async verclientes(req, res) {
        try {
            const clientes = await Cliente.findAll({
                attributes: ['id', 'nombre', 'correo', 'numLic', 'createdAt', 'updatedAt']
                // Excluimos el campo password por seguridad
            });

            res.json({
                mensaje: 'Clientes encontrados',
                clientes
            });

        } catch (error) {
            console.error('Error al obtener clientes:', error);
            res.status(500).json({
                error: 'Error al obtener la lista de clientes'
            });
        }
    }
};

module.exports = clienteController;