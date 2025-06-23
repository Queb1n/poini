const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: "localhost",        // o tu host de la BD
  user: "root",             // tu usuario
  password: "",             // tu contraseña
  database: "sistema_asistencia" // cambia por el nombre de tu base de datos
});

connection.connect(err => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
  } else {
    console.log("✅ Conexión a la base de datos establecida");
  }
});

module.exports = connection;
