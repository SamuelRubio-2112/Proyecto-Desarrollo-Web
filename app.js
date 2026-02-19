// REFERENCIAS AL DOM
const catalogo = document.getElementById("catalogo");
const inputBusqueda = document.getElementById("input-busqueda");
const carritoContenedor = document.getElementById("carrito");
const totalContenedor = document.getElementById("total");

/////////
let carrito = []; //se guarda lo que el usuario va agregando

// PRODUCTOS A LA VENTA
const productos = [
    {
        id: 1,
        nombre: "Cuaderno A4",
        categoria: "Cuadernos",
        precio: 2,
        imagen: "img/cuaderno.jpg",
        descripcion: "Cuaderno tamaño A4, 100 hojas"
    },
    {
        id: 2,
        nombre: "Lápiz HB",
        categoria: "Escritura",
        precio: 1,
        imagen: "img/lapiz.jpg",
        descripcion: "Lápiz grafito HB"
    },
    {
        id: 3,
        nombre: "Bolígrafo azul",
        categoria: "Escritura",
        precio: 2,
        imagen: "img/boligrafo.jpg",
        descripcion: "Bolígrafo tinta azul"
    }
];

// RENDERIZAR CATÁLOGO
// ===============================
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

