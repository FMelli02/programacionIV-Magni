const form = document.getElementById('loginForm');
const inputUsuario = document.getElementById('usuario');
const inputClave = document.getElementById('clave');
const mensaje = document.getElementById('mensaje');

function showMessage(texto, isError = true) {
  mensaje.textContent = texto;
  mensaje.className = isError ? 'mensaje error' : 'mensaje ok';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const user = inputUsuario.value.trim();
  const pass = inputClave.value.trim();

  if (!user || !pass) {
    showMessage('Debe ingresar usuario y password.');
    return;
  }

  try {
    const params = new URLSearchParams({ user, pass });
    const response = await fetch(`/tp1/login.js?${params.toString()}`);
    const data = await response.json();

    if (data.respuesta === 'OK') {
      localStorage.setItem('tp_user', user);
      window.location.href = '/lista.html';
      return;
    }

    showMessage(data.mje || 'Ingreso Invalido, usuario y/o clave incorrecta');
  } catch (error) {
    showMessage(`Error de comunicacion con backend: ${error.message}`);
  }
});
