const { Alquiler, Cliente, Autos } = require('../models');

// POST /api/alquiler — registrar nuevo alquiler
exports.realizarAlquiler = async (req, res) => {
  const { clienteId, autoId, fechaInicio, fechaFin } = req.body;
  try {
    const auto = await Autos.findByPk(autoId);
    if (!auto) {
      return res.status(404).json({ mensaje: 'El auto no existe' });
    }
    if (!auto.disponibilidad) {
      return res.status(400).json({ mensaje: 'El auto no está disponible' });
    }

    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'El cliente no existe' });
    }

    const alquiler = await Alquiler.create({ clienteId, autoId, fechaInicio, fechaFin });
    await auto.update({ disponibilidad: false });

    res.status(201).json({ mensaje: 'Alquiler registrado exitosamente', alquiler });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al registrar el alquiler', error: e.message });
  }
};

// GET /api/alquiler/historial — historial completo
exports.historial = async (req, res) => {
  try {
    const alquileres = await Alquiler.findAll({
      include: [
        { model: Cliente, as: 'clientes', attributes: ['nombre', 'correo', 'numLic'] },
        { model: Autos,   as: 'autos',    attributes: ['marca', 'modelo', 'imagen', 'valorAlquiler', 'anio'] },
      ],
    });
    res.json(alquileres);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener el historial', error: e.message });
  }
};

// GET /api/alquiler/cliente/:clienteId — alquileres de un cliente
exports.alquileresPorCliente = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const alquileres = await Alquiler.findAll({
      where: { clienteId },
      include: [
        {
          model: Autos,
          as: 'autos',
          attributes: ['marca', 'modelo', 'imagen', 'valorAlquiler', 'anio', 'disponibilidad'],
        },
      ],
    });
    res.json(alquileres);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener alquileres del cliente', error: e.message });
  }
};

// PUT /api/alquiler/devolver/:alquilerId — devolver vehículo
exports.devolverVehiculo = async (req, res) => {
  const { alquilerId } = req.params;
  try {
    const alquiler = await Alquiler.findByPk(alquilerId);
    if (!alquiler) {
      return res.status(404).json({ mensaje: 'Alquiler no encontrado' });
    }

    const auto = await Autos.findByPk(alquiler.autoId);
    if (auto) {
      await auto.update({ disponibilidad: true });
    }

    await alquiler.update({ fechaFin: new Date() });

    res.json({ mensaje: 'Vehículo devuelto exitosamente. Ahora está disponible.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al procesar la devolución', error: e.message });
  }
};
