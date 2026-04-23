const { Autos } = require('../models');

// GET /api/autos — todos los autos
exports.getAutos = async (req, res) => {
  try {
    const autos = await Autos.findAll();
    res.json(autos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/autos/disponibles — solo autos disponibles
exports.getAutosDisponibles = async (req, res) => {
  try {
    const autos = await Autos.findAll({ where: { disponibilidad: true } });
    res.json(autos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/autos — registrar nuevo vehículo
exports.createAuto = async (req, res) => {
  try {
    const { marca, modelo, imagen, valorAlquiler, anio } = req.body;

    if (!marca || !modelo || !valorAlquiler || !anio) {
      return res.status(400).json({
        error: 'Los campos marca, modelo, valorAlquiler y anio son obligatorios',
      });
    }

    const nuevoAuto = await Autos.create({
      marca,
      modelo,
      imagen: imagen || null,
      valorAlquiler,
      anio,
      disponibilidad: true,
    });

    res.status(201).json({
      mensaje: 'Vehículo registrado exitosamente',
      auto: nuevoAuto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
