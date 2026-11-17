# Explorador de episodios de Rick and Morty

## Autora
Lourdes Jazmin Avila Olmedo

## Asignatura
Fundamentos de Desarrollo Web · Ingeniería en Informática

## Variante
C · Episodios  
Último dígito de cédula: 8

## Descripción
Página web que permite buscar episodios de Rick and Morty
por nombre y temporada, utilizando una API REST.

Cada tarjeta muestra el nombre, el código del episodio,
la fecha de emisión y la cantidad de personajes.

La página informa los estados de carga, las búsquedas sin
resultados y los errores de conexión. También guarda la
última búsqueda en localStorage y la restaura al recargar.

Se muestran hasta 20 episodios por consulta, correspondientes
a la primera página de resultados de la API.

## Tecnologías utilizadas
- HTML semántico.
- CSS con Flexbox, Grid y diseño responsive.
- JavaScript con fetch, async/await y localStorage.

## API utilizada
https://rickandmortyapi.com/api/episode

## Cómo utilizar
1. Escribir un nombre o seleccionar una temporada.
2. Presionar "Buscar episodios".
3. Consultar las tarjetas de resultados.
4. Recargar la página para recuperar la última búsqueda.

## Captura de pantalla
![Página con resultados de búsqueda](img/captura.png)