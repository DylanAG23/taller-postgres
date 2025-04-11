const express = require('express');
const cors = require('cors');
const client = require('./baseDatos');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/api/prueba', (req, res) => {
  res.status(200).json({
    message: 'API FUNCIONANDO CORRECTAMENTE',
    port: PORT,
    status: 'success'
  });
});

// ====================
// RUTAS PARA PERSONAS
// ====================

// Obtener todas las personas
app.get('/api/personas', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM Persona');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener personas', error: error.message });
  }
});

// Crear una persona
app.post('/api/personas', async (req, res) => {
  const { id, Nombre, Apellido1, Apellido2, DNI } = req.body;
  const query = `INSERT INTO Persona (id, Nombre, Apellido1, Apellido2, DNI) VALUES ($1, $2, $3, $4, $5)`;
  try {
    await client.query(query, [id, Nombre, Apellido1, Apellido2, DNI]);
    res.status(201).json({ id, Nombre, Apellido1, Apellido2, DNI });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear persona', error: error.message });
  }
});

// Actualizar una persona
app.put('/api/personas/:id', async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido1, Apellido2, DNI } = req.body;
  const query = `
    UPDATE Persona
    SET Nombre = $1, Apellido1 = $2, Apellido2 = $3, DNI = $4
    WHERE id = $5
  `;
  try {
    const result = await client.query(query, [Nombre, Apellido1, Apellido2, DNI, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json({ message: 'Persona actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar persona', error: error.message });
  }
});

// Eliminar una persona
app.delete('/api/personas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('DELETE FROM Persona WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar persona', error: error.message });
  }
});


// ====================
// RUTAS PARA COCHES
// ====================

// Obtener todos los coches
app.get('/api/coches', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM Coche');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener coches', error: error.message });
  }
});

// Crear un coche
app.post('/api/coches', async (req, res) => {
  const { Matricula, Marca, Modelo, Caballos, Persona_id } = req.body;
  const query = `
    INSERT INTO Coche (Matricula, Marca, Modelo, Caballos, Persona_id)
    VALUES ($1, $2, $3, $4, $5)
  `;
  try {
    await client.query(query, [Matricula, Marca, Modelo, Caballos, Persona_id]);
    res.status(201).json({ Matricula, Marca, Modelo, Caballos, Persona_id });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear coche', error: error.message });
  }
});

// Actualizar un coche
app.put('/api/coches/:matricula', async (req, res) => {
  const { matricula } = req.params;
  const { Marca, Modelo, Caballos, Persona_id } = req.body;
  const query = `
    UPDATE Coche
    SET Marca = $1, Modelo = $2, Caballos = $3, Persona_id = $4
    WHERE Matricula = $5
  `;
  try {
    const result = await client.query(query, [Marca, Modelo, Caballos, Persona_id, matricula]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Coche no encontrado' });
    }
    res.status(200).json({ message: 'Coche actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar coche', error: error.message });
  }
});

// Eliminar un coche
app.delete('/api/coches/:matricula', async (req, res) => {
  const { matricula } = req.params;
  try {
    const result = await client.query('DELETE FROM Coche WHERE Matricula = $1', [matricula]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Coche no encontrado' });
    }
    res.status(200).json({ message: 'Coche eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar coche', error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
