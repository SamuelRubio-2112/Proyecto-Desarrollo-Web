// REFERENCIAS AL DOM
const catalogo = document.getElementById("catalogo");
const inputBusqueda = document.getElementById("input-busqueda");
const carritoContenedor = document.getElementById("carrito");
const totalContenedor = document.getElementById("total");

/////////
let carrito = []; //se guarda lo que el usuario va agregando

// PRODUCTOS A LA VENTA
const productos = [
    { id: 1,  nombre: "Cuaderno A4",        categoria: "Cuadernos",    precio: 2,  imagen: "recursos visuales/Cuaderno A4.jpg",   descripcion: "Cuaderno tamaño A4, 100 hojas" },
    { id: 2,  nombre: "Lápiz HB",           categoria: "Escritura",    precio: 1,  imagen: "recursos visuales/lapiz.jpg",         descripcion: "Lápiz grafito HB" },
    { id: 3,  nombre: "Bolígrafo azul",      categoria: "Escritura",    precio: 2,  imagen: "recursos visuales/boligrafo.jpg",     descripcion: "Bolígrafo tinta azul" },
    { id: 4,  nombre: "Borrador blanco",     categoria: "Escritura",    precio: 1,  imagen: "recursos visuales/borrador.jpg",      descripcion: "Borrador suave sin manchas" },
    { id: 5,  nombre: "Tijeras escolares",   categoria: "Manualidades", precio: 3,  imagen: "recursos visuales/tijeras.jpg",       descripcion: "Tijeras punta redonda" },
    { id: 6,  nombre: "Pegante en barra",    categoria: "Manualidades", precio: 2,  imagen: "recursos visuales/pegante.jpg",       descripcion: "Pegante sólido 20 g" },
    { id: 7,  nombre: "Regla 30 cm",         categoria: "Geometría",    precio: 1,  imagen: "recursos visuales/regla.jpg",         descripcion: "Regla plástica transparente" },
    { id: 8,  nombre: "Compás metálico",     categoria: "Geometría",    precio: 4,  imagen: "recursos visuales/compas.jpg",        descripcion: "Compás de precisión" },
    { id: 9,  nombre: "Carpeta argollada",   categoria: "Archivadores", precio: 5,  imagen: "recursos visuales/carpeta.jpg",       descripcion: "Carpeta 3 argollas tamaño carta" },
    { id: 10, nombre: "Resaltador amarillo", categoria: "Escritura",    precio: 2,  imagen: "recursos visuales/resaltador.jpg",    descripcion: "Resaltador fluor punta biselada" },
    { id: 11, nombre: "Colores x12",         categoria: "Manualidades", precio: 5,  imagen: "recursos visuales/colores.jpg",       descripcion: "Caja 12 colores surtidos" },
    { id: 12, nombre: "Post-it 100 hojas",   categoria: "Organización", precio: 3,  imagen: "recursos visuales/postit.jpg",        descripcion: "Bloc notas adhesivas amarillas" },
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
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        const producto = productos.find(p => p.id === id);
        carrito.push({ ...producto, cantidad: 1 });
    }

    renderizarCarrito();
}

// CAMBIAR CANTIDAD
function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    renderizarCarrito();
}

// ELIMINAR DEL CARRITO
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    renderizarCarrito();
}

// RENDERIZAR CARRITO
function renderizarCarrito() {
    if (carrito.length === 0) {
        carritoContenedor.innerHTML = `<p>El carrito está vacío</p>`;
        totalContenedor.innerHTML   = `<span>Total</span><strong>$0</strong>`;
        actualizarBadge();
        return;
    }

    carritoContenedor.innerHTML = "";

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;

        const div = document.createElement("div");
        div.classList.add("item-carrito");

        div.innerHTML = `
            <div class="item-top">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-info">
                    <p class="item-nombre">${item.nombre}</p>
                    <p class="item-desc">${item.descripcion}</p>
                </div>
            </div>
            <div class="item-bottom">
                <div class="item-controles">
                    <button class="btn-cantidad" data-id="${item.id}" data-cambio="-1">−</button>
                    <span class="item-cantidad">${item.cantidad}</span>
                    <button class="btn-cantidad" data-id="${item.id}" data-cambio="1">+</button>
                </div>
                <div class="item-precios">
                    <span class="item-precio">$${item.precio} c/u</span>
                    <span class="item-subtotal">$${subtotal.toFixed(2)}</span>
                </div>
                <button class="btn-eliminar" data-id="${item.id}" title="Eliminar">
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
            </div>
        `;

        carritoContenedor.appendChild(div);
    });

    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    totalContenedor.innerHTML = `<span>Total</span><strong>$${total.toFixed(2)}</strong>`;

    actualizarBadge();
}

// BADGE DEL BOTÓN CARRITO
function actualizarBadge() {
    const btn = document.getElementById("btn-abrir-carrito");
    if (!btn) return;

    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    btn.textContent = totalItems > 0 ? `🛒 Carrito (${totalItems})` : `🛒 Carrito`;
}

// EVENTOS – delegación en el catálogo y en el carrito
catalogo.addEventListener("click", function(e) {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    agregarAlCarrito(Number(btn.dataset.id));
});

carritoContenedor.addEventListener("click", function(e) {
    const btnCantidad = e.target.closest(".btn-cantidad");
    if (btnCantidad) {
        cambiarCantidad(Number(btnCantidad.dataset.id), Number(btnCantidad.dataset.cambio));
        return;
    }

    const btnEliminar = e.target.closest(".btn-eliminar");
    if (btnEliminar) {
        eliminarDelCarrito(Number(btnEliminar.dataset.id));
    }
});

// BÚSQUEDA
inputBusqueda.addEventListener("input", function() {
    const texto = this.value.toLowerCase().trim();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    renderizarCatalogo(filtrados);
});