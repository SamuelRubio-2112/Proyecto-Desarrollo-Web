// REFERENCIAS AL DOM
const catalogo = document.getElementById("catalogo");
const inputBusqueda = document.getElementById("input-busqueda");
const carritoContenedor = document.getElementById("carrito");
const totalContenedor = document.getElementById("total");

/////////
let carrito = []; //se guarda lo que el usuario va agregando

// PRODUCTOS A LA VENTA
const productos = [
    { id: 1,  nombre: "Cuaderno A4",        categoria: "Cuadernos", precio: 2,  imagen: "img/cuaderno.jpg",    descripcion: "Cuaderno tamaño A4, 100 hojas" },
    { id: 2,  nombre: "Lápiz HB",           categoria: "Escritura", precio: 1,  imagen: "img/lapiz.jpg",       descripcion: "Lápiz grafito HB" },
    { id: 3,  nombre: "Bolígrafo azul",      categoria: "Escritura", precio: 2,  imagen: "img/boligrafo.jpg",   descripcion: "Bolígrafo tinta azul" },
    { id: 4,  nombre: "Borrador blanco",     categoria: "Escritura", precio: 1,  imagen: "img/borrador.jpg",    descripcion: "Borrador suave sin manchas" },
    { id: 5,  nombre: "Tijeras escolares",   categoria: "Manualidades", precio: 3, imagen: "img/tijeras.jpg",   descripcion: "Tijeras punta redonda" },
    { id: 6,  nombre: "Pegante en barra",    categoria: "Manualidades", precio: 2, imagen: "img/pegante.jpg",   descripcion: "Pegante sólido 20 g" },
    { id: 7,  nombre: "Regla 30 cm",         categoria: "Geometría", precio: 1,  imagen: "img/regla.jpg",       descripcion: "Regla plástica transparente" },
    { id: 8,  nombre: "Compás metálico",     categoria: "Geometría", precio: 4,  imagen: "img/compas.jpg",      descripcion: "Compás de precisión" },
    { id: 9,  nombre: "Carpeta argollada",   categoria: "Archivadores", precio: 5, imagen: "img/carpeta.jpg",   descripcion: "Carpeta 3 argollas tamaño carta" },
    { id: 10, nombre: "Resaltador amarillo", categoria: "Escritura", precio: 2,  imagen: "img/resaltador.jpg",  descripcion: "Resaltador fluor punta biselada" },
    { id: 11, nombre: "Colores x12",         categoria: "Manualidades", precio: 5, imagen: "img/colores.jpg",   descripcion: "Caja 12 colores surtidos" },
    { id: 12, nombre: "Post-it 100 hojas",   categoria: "Organización", precio: 3, imagen: "img/postit.jpg",    descripcion: "Bloc notas adhesivas amarillas" },
];

// RENDERIZAR CATÁLOGO
function renderizarCatalogo(listaProductos) {
    catalogo.innerHTML = "";

    listaProductos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("producto");

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>$${producto.precio}</strong></p>
            <button data-id="${producto.id}">
                Agregar al carrito
            </button>
        `;

        catalogo.appendChild(tarjeta);
    });
}

renderizarCatalogo(productos);

// AGREGAR AL CARRITO
function agregarAlCarrito(id) {
    // ¿Ya está en el carrito?
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        // Solo sube la cantidad
        itemExistente.cantidad++;
    } else {
        // Busca el producto y lo agrega con cantidad 1
        const producto = productos.find(p => p.id === id);
        carrito.push({ ...producto, cantidad: 1 });
    }

    renderizarCarrito();
}