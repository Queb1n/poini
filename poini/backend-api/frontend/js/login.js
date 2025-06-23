document.addEventListener("DOMContentLoaded", () => {
  const rolSelect = document.getElementById("rol");
  const mat = document.getElementById("matricula");

  rolSelect.addEventListener("change", () => {
    mat.placeholder = rolSelect.value === "profesor" ? "Clave Profesor" : "Matrícula";
  });

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const rol = rolSelect.value.trim();
    const matricula = mat.value.trim();
    const password = document.getElementById("password").value.trim();
    const errorElem = document.getElementById("error");
    errorElem.textContent = "";

    if (!matricula || !password) {
      errorElem.textContent = "Por favor llena todos los campos.";
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ matricula, password, rol }),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Credenciales incorrectas");
      }

      const user = await res.json();
      localStorage.setItem("usuario", JSON.stringify(user));

      if (user.rol === "admin") {
        location.href = "admin_panel.html";
      } else if (user.rol === "profesor") {
        location.href = "profesor.html";
      } else {
        location.href = "alumno.html";
      }
    } catch (err) {
      errorElem.textContent = err.message;
    }
  });
});
