const tbody = document.getElementById('tbodyUsuarios');
const inputSearch = document.getElementById('searchUsuario');
const btnBuscar = document.getElementById('btnBuscar');
const btnLimpiar = document.getElementById('btnLimpiar');
const mensaje = document.getElementById('mensaje');

function showMessage(texto, isError = false) {
  mensaje.textContent = texto;
  mensaje.className = isError ? 'mensaje error' : 'mensaje';
}

function renderRows(usuarios) {
  tbody.innerHTML = '';

  usuarios.forEach((u) => {
    const tr = document.createElement('tr');
    tr.className = String(u.bloqueado).toUpperCase() === 'Y' ? 'row-bloqueado' : 'row-activo';

    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.usuario}</td>
      <td>${u.bloqueado}</td>
      <td>${u.apellido}</td>
      <td>${u.nombre}</td>
      <td><button data-id="${u.id}" data-estado="Y">Bloquear</button></td>
      <td><button data-id="${u.id}" data-estado="N" class="secondary">Desbloquear</button></td>
    `;

    tbody.appendChild(tr);
  });
}

async function buscarUsuarios() {
  try {
    const usuario = inputSearch.value.trim();
    const params = new URLSearchParams({ action: 'BUSCAR' });
    if (usuario) {
      params.append('usuario', usuario);
    }

    const response = await fetch(`/tp/lista.js?${params.toString()}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      showMessage('Respuesta inesperada del backend.', true);
      return;
    }

    if (data.length === 0) {
      tbody.innerHTML = '';
      showMessage('No se encontraron usuarios para la busqueda.');
      return;
    }

    showMessage('');
    renderRows(data);
  } catch (error) {
    showMessage(`Error al buscar usuarios: ${error.message}`, true);
  }
}

async function cambiarEstado(idUser, estado) {
  try {
    const params = new URLSearchParams({ action: 'BLOQUEAR', idUser, estado });
    const response = await fetch(`/tp/lista.js?${params.toString()}`);
    const data = await response.json();

    if (data.respuesta !== 'OK') {
      showMessage(data.mje || 'No se pudo actualizar el estado.', true);
      return;
    }

    showMessage(data.mje || 'Bloqueo Exitoso');
    await buscarUsuarios();
  } catch (error) {
    showMessage(`Error al cambiar estado: ${error.message}`, true);
  }
}

tbody.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const idUser = target.dataset.id;
  const estado = target.dataset.estado;

  if (!idUser || !estado) {
    return;
  }

  cambiarEstado(idUser, estado);
});

btnBuscar.addEventListener('click', buscarUsuarios);
btnLimpiar.addEventListener('click', () => {
  inputSearch.value = '';
  buscarUsuarios();
});

buscarUsuarios();
