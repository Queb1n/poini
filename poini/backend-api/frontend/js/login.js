document.addEventListener("DOMContentLoaded", () => {
  const rolSelect = document.getElementById("rol");
  rolSelect.addEventListener("change", () => {
    const mat = document.getElementById("matricula");
    mat.placeholder = rolSelect.value === "profesor" ? "Clave Profesor" : "Matrícula";
  });
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const rol = document.getElementById("rol").value;
  const matricula = document.getElementById("matricula").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3000/api/login", {
    method: "POST",
    body: JSON.stringify({ matricula, password, rol }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => {
    if (!res.ok) throw new Error("Credenciales incorrectas");
    return res.json();
  })
  .then(user => {
    localStorage.setItem("usuario", JSON.stringify(user));

    if (user.rol === "admin") {
      location.href = "admin_panel.html";
    } else if (user.rol === "profesor") {
      location.href = "profesor.html";
    } else {
      location.href = "alumno.html";
    }
  })
  .catch(err => {
    document.getElementById("error").textContent = err.message;
  });
});
