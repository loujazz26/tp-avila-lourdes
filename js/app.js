// 1. Referencias a los elementos del HTML
const formulario = document.getElementById("formulario-busqueda");
const campoNombre = document.getElementById("nombre");
const campoTemporada = document.getElementById("temporada");
const botonBuscar = document.getElementById("boton-buscar");
const contenedorResultados = document.getElementById("resultados");
const mensaje = document.getElementById("mensaje");

// 2. Mostrar un mensaje en la página
const mostrarMensaje = (texto) => {
  mensaje.textContent = texto;
};

// 3. Reemplazar datos vacíos o desconocidos
const normalizarDato = (valor) => {
  if (
    valor === null ||
    valor === undefined ||
    String(valor).trim() === "" ||
    String(valor).trim().toLowerCase() === "unknown"
  ) {
    return "Desconocido";
  }

  return String(valor);
};

// 4. Crear un párrafo con una etiqueta y su valor
const crearDetalle = (etiqueta, valor) => {
  const parrafo = document.createElement("p");
  parrafo.textContent = `${etiqueta}: ${normalizarDato(valor)}`;

  return parrafo;
};

// 5. Crear la tarjeta de un episodio
const crearTarjeta = (episodio) => {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");

  const titulo = document.createElement("h3");
  titulo.textContent = normalizarDato(episodio.name);

  const codigo = crearDetalle("Código", episodio.episode);
  const fecha = crearDetalle("Fecha de emisión", episodio.air_date);

  const cantidadPersonajes = Array.isArray(episodio.characters)
    ? episodio.characters.length
    : null;

  const personajes = crearDetalle(
    "Cantidad de personajes",
    cantidadPersonajes
  );

  tarjeta.append(titulo, codigo, fecha, personajes);

  return tarjeta;
};

// 6. Mostrar todas las tarjetas recibidas
const mostrarEpisodios = (episodios) => {
  contenedorResultados.replaceChildren();

  episodios.forEach((episodio) => {
    const tarjeta = crearTarjeta(episodio);
    contenedorResultados.append(tarjeta);
  });
};

// 7. Consultar la API
const obtenerEpisodios = async (nombre, temporada) => {
  const url = new URL("https://rickandmortyapi.com/api/episode");

  if (nombre !== "") {
    url.searchParams.set("name", nombre);
  }

  if (temporada !== "") {
    url.searchParams.set("episode", temporada);
  }

  const respuesta = await fetch(url);

  // La consigna indica que 404 significa "sin resultados".
  if (respuesta.status === 404) {
    return [];
  }

  if (!respuesta.ok) {
    throw new Error(`Error HTTP: ${respuesta.status}`);
  }

  const datos = await respuesta.json();

  return datos.results;
};

// 8. Coordinar la búsqueda y sus estados
const buscarEpisodios = async (nombre, temporada) => {
  if (nombre === "" && temporada === "") {
    contenedorResultados.replaceChildren();
    mostrarMensaje("Escribe un nombre o selecciona una temporada.");
    return;
  }

  botonBuscar.disabled = true;
  botonBuscar.textContent = "Buscando…";
  contenedorResultados.replaceChildren();
  mostrarMensaje("Buscando…");

  try {
    const episodios = await obtenerEpisodios(nombre, temporada);

    mostrarEpisodios(episodios);

    if (episodios.length === 0) {
      mostrarMensaje("No se encontraron episodios con esos criterios.");
    } else {
      mostrarMensaje(
        `Se muestran ${episodios.length} episodios en esta página de resultados.`
      );
    }
  } catch (error) {
    mostrarMensaje(
      "No se pudo realizar la búsqueda. Comprueba tu conexión e inténtalo nuevamente."
    );
  } finally {
    botonBuscar.disabled = false;
    botonBuscar.textContent = "Buscar episodios";
  }
};

// 9. Guardar los criterios de la última búsqueda
const guardarBusqueda = (nombre, temporada) => {
  const busqueda = {
    nombre,
    temporada
  };

  try {
    localStorage.setItem(
      "ultimaBusquedaEpisodios",
      JSON.stringify(busqueda)
    );
  } catch (error) {
    // La búsqueda puede continuar aunque no se pueda guardar.
    mostrarMensaje(
      "El navegador no permitió guardar la última búsqueda."
    );
  }
};

// 10. Recuperar la búsqueda guardada
const restaurarBusqueda = () => {
  let busqueda;

  try {
    const datosGuardados = localStorage.getItem(
      "ultimaBusquedaEpisodios"
    );

    if (datosGuardados === null) {
      return;
    }

    busqueda = JSON.parse(datosGuardados);
  } catch (error) {
    mostrarMensaje("No se pudo recuperar la última búsqueda.");
    return;
  }

  // Comprobar que los datos guardados tengan el formato esperado.
  if (
    busqueda === null ||
    typeof busqueda !== "object" ||
    typeof busqueda.nombre !== "string" ||
    typeof busqueda.temporada !== "string"
  ) {
    return;
  }

  const temporadasValidas = ["", "S01", "S02", "S03", "S04", "S05"];

  if (!temporadasValidas.includes(busqueda.temporada)) {
    return;
  }

  const nombre = busqueda.nombre.trim();
  const temporada = busqueda.temporada;

  campoNombre.value = nombre;
  campoTemporada.value = temporada;

  if (nombre !== "" || temporada !== "") {
    buscarEpisodios(nombre, temporada);
  }
};

// 11. Escuchar el envío del formulario
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nombre = campoNombre.value.trim();
  const temporada = campoTemporada.value;

  await buscarEpisodios(nombre, temporada);

  // Guardar únicamente si hay al menos un criterio.
  if (nombre !== "" || temporada !== "") {
    guardarBusqueda(nombre, temporada);
  }
});

// 12. Restaurar la búsqueda al abrir la página
restaurarBusqueda();