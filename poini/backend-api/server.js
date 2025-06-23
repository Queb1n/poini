const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require('./conexion');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, "frontend")));

// Ruta raíz que envía el archivo login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

// 🔐 Login
app.post("/api/login", (req, res) => {
  const { matricula, password, rol } = req.body;

  const query = "SELECT * FROM usuarios WHERE matricula = ? AND password = ? AND rol = ?";
  db.query(query, [matricula, password, rol], (err, results) => {
    if (err) {
      console.error("Error en login:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    if (results.length > 0) {
      const usuario = results[0];
      const queryMaterias = "SELECT clave_materia FROM usuarios_materias WHERE id_usuario = ?";
      db.query(queryMaterias, [usuario.id_usuario], (err2, materiasResult) => {
        if (err2) return res.status(500).json({ error: "Error al obtener materias" });
        usuario.materias = materiasResult.map(m => m.clave_materia);
        res.json(usuario);
      });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  });
});

// 📥 Obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
  const query = "SELECT * FROM usuarios";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return res.status(500).json({ error: "Error interno" });
    }
    res.json(results);
  });
});

// ➕ Registrar nuevo usuario
app.post("/api/usuarios", (req, res) => {
  const {
    matricula,
    password,
    rol,
    nombre,
    ape1,
    ape2,
    correo,
    grupo,
    materias = []
  } = req.body;

  const query = `INSERT INTO usuarios (matricula, password, rol, nombre, ape1, ape2, correo, grupo)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [matricula, password, rol, nombre, ape1, ape2, correo, grupo || null], (err, result) => {
    if (err) {
      console.error("Error al insertar usuario:", err);
      return res.status(500).json({ error: "Error al insertar usuario" });
    }

    const id_usuario = result.insertId;

    if (materias.length > 0) {
      const values = materias.map(m => [id_usuario, m]);
      db.query("INSERT INTO usuarios_materias (id_usuario, clave_materia) VALUES ?", [values], err2 => {
        if (err2) {
          console.error("Error al insertar materias:", err2);
          return res.status(500).json({ error: "Usuario creado pero error al guardar materias" });
        }
        res.status(201).json({ mensaje: "Usuario registrado con materias" });
      });
    } else {
      res.status(201).json({ mensaje: "Usuario registrado sin materias" });
    }
  });
});

// ❌ Eliminar usuario por matrícula
app.delete("/api/usuarios/:matricula", (req, res) => {
  const { matricula } = req.params;

  const query = "DELETE FROM usuarios WHERE matricula = ?";
  db.query(query, [matricula], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      return res.status(500).json({ error: "Error al eliminar usuario" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  });
});

// 🟢 Iniciar servidor en el puerto del .env o por defecto en 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API funcionando en http://localhost:${PORT}`));
