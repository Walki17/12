let peliculas = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      peliculas = data;
    })
    .catch(error => console.error('Error al cargar las películas:', error));
});

// Buscar películas
document.getElementById('btnBuscar').addEventListener('click', () => {
  const query = document.getElementById('inputBuscar').value.trim().toLowerCase();
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  if (query) {
    const resultados = peliculas.filter(pelicula =>
      [pelicula.title, pelicula.tagline, pelicula.genres.join(', '), pelicula.overview]
        .some(text => text.toLowerCase().includes(query))
    );

    resultados.forEach(pelicula => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'bg-dark', 'text-light');
      li.innerHTML = `
        <div class="text-container">
        <h5>${pelicula.title}</h5>
        <p>${pelicula.tagline}</p>
        </div>
        <div>${getEstrellas(pelicula.vote_average)}</div>
      `;
      li.addEventListener('click', () => mostrarDetalles(pelicula));
      lista.appendChild(li);
    });
  }
});

function mostrarDetalles({ title, overview, genres, release_date, runtime, budget, revenue }) {
    const detalles = document.getElementById('detallesPelicula');
    detalles.style.display = 'block';

    const generos = genres.map(genre => genre.name).join(', ');
    const añoLanzamiento = release_date.split('-')[0];

    detalles.innerHTML = `
      <div class="detalles-header">
        <span class="close" id="btnCerrarDetalles">&times;</span>
        <h3>${title}</h3>
      </div>
      <p>${overview}</p>
      <p><strong>Géneros:</strong> ${generos}</p>
      <button id="btnMas" class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#detallesExtra">
        Ver más
      </button>
      <div id="detallesExtra" class="collapse mt-3">
        <p><strong>Año de lanzamiento:</strong> ${añoLanzamiento}</p>
        <p><strong>Duración:</strong> ${runtime} minutos</p>
        <p><strong>Presupuesto:</strong> $${formatoNumero(budget)}</p>
        <p><strong>Ganancias:</strong> $${formatoNumero(revenue)}</p>
      </div>
    `;

    const btnCerrarDetalles = document.getElementById('btnCerrarDetalles');
    btnCerrarDetalles.removeEventListener('click', cerrarDetalles);
    btnCerrarDetalles.addEventListener('click', cerrarDetalles);

    // Desplazar la página hacia el contenedor de detalles
    detalles.scrollIntoView({ behavior: 'smooth' });
}

function cerrarDetalles() {
    document.getElementById('detallesPelicula').style.display = 'none';
}

//Formato lindo de números
function formatoNumero(numero) {
    return new Intl.NumberFormat('es-ES').format(numero);
}

    
//Hacer estrellas la puntuación
function getEstrellas(vote) {
  const estrellas = Math.round(vote / 2);
  let estrellasHTML = '<div class="estrella-container">';

  for (let i = 1; i <= 5; i++) {
    estrellasHTML += `<i class="fa fa-star${i <= estrellas ? '' : '-o'} estrella estrella-${i}"></i>`;
  }

  estrellasHTML += '</div>';
  return estrellasHTML;
}
