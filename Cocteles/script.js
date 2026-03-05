// =============================================
//  COCKTAIL BAR — script.js
//  API: TheCocktailDB (https://www.thecocktaildb.com)
// =============================================

// ── CONSTANTES DE LA API ──────────────────────
const API_RANDOM = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const API_LOOKUP = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

// ── REFERENCIAS AL DOM ────────────────────────
const btnAleatorio       = document.getElementById("btn-aleatorio");
const loader             = document.getElementById("loader");
const errorMsg           = document.getElementById("error-msg");
const errorTexto         = document.getElementById("error-texto");
const detalleCoctel      = document.getElementById("detalle-coctel");

// Elementos del detalle
const imgEl              = document.getElementById("coctel-imagen");
const nombreEl           = document.getElementById("coctel-nombre");
const categoriaEl        = document.getElementById("coctel-categoria");
const idEl               = document.getElementById("coctel-id");
const ingredientesEl     = document.getElementById("lista-ingredientes");
const instruccionesEl    = document.getElementById("coctel-instrucciones");

// Botón favorito
const btnFavorito        = document.getElementById("btn-favorito");
const favIconEl          = document.getElementById("fav-icon");
const favTextoEl         = document.getElementById("fav-texto");

// Sección favoritos
const favoritosVacio     = document.getElementById("favoritos-vacio");
const listaFavoritosEl   = document.getElementById("lista-favoritos");

// ── ESTADO DE LA APP ──────────────────────────
// Guarda el cóctel que se está mostrando actualmente
let coctelActual = null;

// ── CLAVE DE LOCALSTORAGE ─────────────────────
const LS_KEY = "cocktail_favoritos";

// =============================================
//  FUNCIONES DE UI (MOSTRAR / OCULTAR)
// =============================================

/** Muestra solo el loader y oculta el resto */
function mostrarLoader() {
    loader.hidden          = false;
    detalleCoctel.hidden   = true;
    errorMsg.hidden        = true;
}

/** Oculta el loader */
function ocultarLoader() {
    loader.hidden = true;
}

/** Muestra el detalle y oculta error */
function mostrarDetalle() {
    detalleCoctel.hidden = false;
    errorMsg.hidden      = true;
}

/** Muestra un mensaje de error con texto personalizado */
function mostrarError(mensaje) {
    ocultarLoader();
    detalleCoctel.hidden = true;
    errorMsg.hidden      = false;
    errorTexto.textContent = mensaje;
}

// =============================================
//  RENDERIZAR EL CÓCTEL EN PANTALLA
// =============================================

/**
 * Recibe el objeto "drink" que devuelve la API y
 * pinta todos sus datos en el DOM.
 */
function renderizarCoctel(drink) {
    // Datos básicos
    imgEl.src             = drink.strDrinkThumb;
    imgEl.alt             = drink.strDrink;
    nombreEl.textContent  = drink.strDrink;
    categoriaEl.textContent = drink.strCategory || "Sin categoría";
    idEl.textContent      = drink.idDrink;
    instruccionesEl.textContent = drink.strInstructions || "Sin instrucciones disponibles.";

    // Ingredientes: la API devuelve hasta 15 pares strIngredient1/strMeasure1, etc.
    ingredientesEl.innerHTML = "";

    for (let i = 1; i <= 15; i++) {
        const nombre   = drink[`strIngredient${i}`];
        const cantidad = drink[`strMeasure${i}`];

        // Si no hay ingrediente, terminamos el bucle
        if (!nombre || nombre.trim() === "") break;

        const li = document.createElement("li");
        li.innerHTML = `
            <span class="ingrediente-nombre">${nombre.trim()}</span>
            <span class="ingrediente-cantidad">${cantidad ? cantidad.trim() : "c/s"}</span>
        `;
        ingredientesEl.appendChild(li);
    }

    // Actualizar botón de favorito según si ya está guardado
    actualizarBotonFavorito(drink.idDrink);

    // Mostrar el detalle en pantalla
    ocultarLoader();
    mostrarDetalle();
}

// =============================================
//  LLAMADAS A LA API (async / await)
// =============================================

/**
 * Obtiene un cóctel aleatorio de la API y lo muestra.
 * Maneja el loader y los errores.
 */
async function cargarAleatorio() {
    mostrarLoader();

    try {
        const respuesta = await fetch(API_RANDOM);

        // Verificar que la respuesta HTTP fue exitosa
        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        // La API retorna { drinks: [objeto] } o { drinks: null }
        if (!datos.drinks || datos.drinks.length === 0) {
            throw new Error("La API no devolvió resultados. Intenta de nuevo.");
        }

        // Guardamos el cóctel actual para usarlo en el botón de favorito
        coctelActual = datos.drinks[0];
        renderizarCoctel(coctelActual);

    } catch (error) {
        // Distinguir error de red vs. error de la API
        if (error.message === "Failed to fetch") {
            mostrarError("Sin conexión a Internet. Verifica tu red e intenta de nuevo.");
        } else {
            mostrarError(error.message);
        }
    }
}

/**
 * Busca un cóctel por su ID en la API y lo muestra.
 * Se usa cuando el usuario selecciona un favorito.
 */
async function cargarPorId(id) {
    mostrarLoader();

    try {
        const respuesta = await fetch(API_LOOKUP + id);

        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (!datos.drinks || datos.drinks.length === 0) {
            throw new Error(`No se encontró un cóctel con ID ${id}.`);
        }

        coctelActual = datos.drinks[0];
        renderizarCoctel(coctelActual);

        // Scroll suave al inicio para ver el detalle
        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        if (error.message === "Failed to fetch") {
            mostrarError("Sin conexión a Internet. Verifica tu red e intenta de nuevo.");
        } else {
            mostrarError(error.message);
        }
    }
}

// =============================================
//  FAVORITOS — localStorage
//  REGLA: solo guardar { id, nombre }
// =============================================

/** Lee el arreglo de favoritos desde localStorage */
function leerFavoritos() {
    const datos = localStorage.getItem(LS_KEY);
    return datos ? JSON.parse(datos) : [];
}

/** Guarda el arreglo de favoritos en localStorage */
function guardarFavoritos(favoritos) {
    // Solo guardamos objetos con { id, nombre } — regla del reto
    localStorage.setItem(LS_KEY, JSON.stringify(favoritos));
}

/** Verifica si un cóctel (por ID) ya está en favoritos */
function esFavorito(id) {
    const favoritos = leerFavoritos();
    return favoritos.some(fav => fav.id === id);
}

/**
 * Agrega el cóctel actual a favoritos si no está duplicado.
 * Solo guarda { id, nombre }.
 */
function agregarFavorito(id, nombre) {
    const favoritos = leerFavoritos();

    // Prevenir duplicados
    if (favoritos.some(fav => fav.id === id)) return;

    favoritos.push({ id, nombre });
    guardarFavoritos(favoritos);
    renderizarFavoritos();
}

/** Elimina un favorito por su ID */
function eliminarFavorito(id) {
    const favoritos = leerFavoritos().filter(fav => fav.id !== id);
    guardarFavoritos(favoritos);
    renderizarFavoritos();

    // Actualizar el botón si el cóctel visible es el eliminado
    if (coctelActual && coctelActual.idDrink === id) {
        actualizarBotonFavorito(id);
    }
}

/**
 * Actualiza el botón de guardar/eliminar favorito
 * según si el cóctel actual ya está en la lista.
 */
function actualizarBotonFavorito(id) {
    if (esFavorito(id)) {
        btnFavorito.classList.add("guardado");
        favTextoEl.textContent = "Eliminar favorito";
    } else {
        btnFavorito.classList.remove("guardado");
        favTextoEl.textContent = "Guardar favorito";
    }
}

/**
 * Renderiza la lista de favoritos en el panel lateral.
 * Muestra el "estado vacío" si no hay ninguno.
 */
function renderizarFavoritos() {
    const favoritos = leerFavoritos();

    if (favoritos.length === 0) {
        // Mostrar estado vacío
        favoritosVacio.hidden    = false;
        listaFavoritosEl.hidden  = true;
        return;
    }

    // Ocultar estado vacío y construir la lista
    favoritosVacio.hidden    = true;
    listaFavoritosEl.hidden  = false;
    listaFavoritosEl.innerHTML = "";

    favoritos.forEach(fav => {
        const li = document.createElement("li");
        li.classList.add("favorito-item");

        // Botón para seleccionar el favorito y ver su detalle
        const btnNombre = document.createElement("button");
        btnNombre.classList.add("btn-fav-nombre");
        btnNombre.textContent = fav.nombre;
        btnNombre.title = `Ver detalle de ${fav.nombre}`;
        btnNombre.addEventListener("click", () => cargarPorId(fav.id));

        // Botón para eliminar de favoritos
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn-eliminar-fav");
        btnEliminar.textContent = "✕";
        btnEliminar.title = "Eliminar de favoritos";
        btnEliminar.addEventListener("click", () => eliminarFavorito(fav.id));

        li.appendChild(btnNombre);
        li.appendChild(btnEliminar);
        listaFavoritosEl.appendChild(li);
    });
}

// =============================================
//  EVENTO — Botón de favorito
// =============================================

btnFavorito.addEventListener("click", () => {
    if (!coctelActual) return;

    const id     = coctelActual.idDrink;
    const nombre = coctelActual.strDrink;

    if (esFavorito(id)) {
        eliminarFavorito(id);
    } else {
        agregarFavorito(id, nombre);
    }

    // Actualizar apariencia del botón
    actualizarBotonFavorito(id);
});

// =============================================
//  EVENTO — Botón aleatorio
// =============================================

btnAleatorio.addEventListener("click", cargarAleatorio);

// =============================================
//  INICIO — Carga automática al abrir la página
// =============================================

// 1. Renderizar favoritos guardados (si los hay)
renderizarFavoritos();

// 2. Cargar un cóctel aleatorio automáticamente
cargarAleatorio();
