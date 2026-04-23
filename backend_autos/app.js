const express = require("express");
const cors = require("cors");
require("dotenv").config();

const autosRoutes    = require("./routes/autosRoutes");
const alquilerRoutes = require("./routes/alquilerRoutes");
const clienteRoutes  = require("./routes/clienteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ── Rutas ──────────────────────────────────────────────
app.use("/api/autos",    autosRoutes);
app.use("/api/alquiler", alquilerRoutes);
app.use("/api/clientes", clienteRoutes);

app.get("/", (req, res) => res.send("API Alquiler de Autos 🚗"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`);
});
