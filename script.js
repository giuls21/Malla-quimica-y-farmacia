const ramos = [
  // (Aquí van todos los ramos desde el 1° al 10° semestre, como ya los tienes)
  // Ejemplo:
  { id: "qyf101", nombre: "QYF101 - Química General", semestre: 1 },
  { id: "qyf201", nombre: "QYF201 - Química Inorgánica", semestre: 2, prerqs: ["qyf101"] },
  // ...
];

const container = document.getElementById("malla");
const totalSemestres = Math.max(...ramos.map(r => r.semestre));

for (let i = 1; i <= totalSemestres; i++) {
  const box = document.createElement("div");
  box.className = "semestre";
  box.innerHTML = `<h3>${i}º Semestre</h3>`;
  container.appendChild(box);

  ramos.filter(r => r.semestre === i).forEach(ramo => {
    const btn = document.createElement("button");
    btn.textContent = ramo.nombre;
    btn.className = "ramo";
    btn.id = ramo.id;
    if (ramo.prerqs) {
      btn.classList.add("bloqueado");
      btn.disabled = true;
      btn.dataset.prerqs = ramo.prerqs.join(",");
    }
    if (localStorage.getItem(ramo.id) === 'aprobado') {
      btn.classList.add("aprobado");
    }
    box.appendChild(btn);
  });
}

function actualizarEstado() {
  document.querySelectorAll('.ramo').forEach(ramo => {
    const prerqs = ramo.dataset.prerqs?.split(',') || [];
    const aprobado = ramo.classList.contains('aprobado');
    if (prerqs.length > 0 && !aprobado) {
      const cumplidos = prerqs.every(id => document.getElementById(id)?.classList.contains('aprobado'));
      if (cumplidos) {
        ramo.classList.remove("bloqueado");
        ramo.disabled = false;
      } else {
        ramo.classList.add("bloqueado");
        ramo.disabled = true;
      }
    }
  });
}

document.querySelectorAll('.ramo').forEach(ramo => {
  ramo.addEventListener('click', () => {
    if (ramo.classList.contains('bloqueado')) return;
    ramo.classList.toggle('aprobado');
    if (ramo.classList.contains('aprobado')) {
      localStorage.setItem(ramo.id, 'aprobado');
    } else {
      localStorage.removeItem(ramo.id);
    }
    actualizarEstado();
  });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

actualizarEstado();
