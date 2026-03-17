/* =========================================
   1. BASE DE DATOS Y ESTADO
   ========================================= */
const platos = [
    {
        nombre: "Smash Burger Clásica",
        descripcion: "Doble medallón smash de 100g, doble cheddar, cebolla crispy y nuestra salsa secreta en pan brioche.",
        precio: "$8.500",
        imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80"
    },
    {
        nombre: "Baconator Americana",
        descripcion: "Medallón de 180g, cuádruple panceta ahumada, cheddar derretido y salsa barbacoa.",
        precio: "$9.200",
        imagen: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=500&q=80"
    },
    {
        nombre: "Papas con Cheddar y Verdeo",
        descripcion: "Porción abundante de papas fritas rústicas bañadas en salsa cheddar casera, panceta y cebolla de verdeo.",
        precio: "$5.500",
        imagen: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80"
    },
    {
        nombre: "Pollo Crispy XXL",
        descripcion: "Pechuga de pollo frita extracrujiente, lechuga repollada, tomate y mayonesa de ajo.",
        precio: "$8.000",
        imagen: "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=500&q=80"
    }
];

let carrito = []; 

const contenedor = document.getElementById("contenedor-menu");

/* =========================================
   2. RENDERIZADO DEL MENÚ
   ========================================= */
function renderizarPlatos() {
    platos.map(plato => {
        const card = document.createElement("div");
        card.classList.add("plato");

        card.innerHTML = `
            <img src="${plato.imagen}" alt="${plato.nombre}">
            <div class="info-plato">
                <h3>${plato.nombre}</h3>
                <p class="precio-card">${plato.precio}</p>
                <button class="btn-agregar">Agregar al Carrito</button>
            </div>
        `;

        const btnAgregar = card.querySelector(".btn-agregar");
        btnAgregar.onclick = function(e) {
            e.stopPropagation(); 
            agregarAlCarrito(plato.nombre, plato.precio);
        };

        card.onclick = function() {
            abrirModal(plato.nombre, plato.descripcion, plato.precio, plato.imagen);
        };

        contenedor.appendChild(card);
    });
}

/* =========================================
   3. LÓGICA DEL CARRITO
   ========================================= */

function agregarAlCarrito(nombre, precio) {
    // Usamos Date.now() como ID único para poder borrar el item exacto después
    const producto = { 
        id: Date.now(), 
        nombre, 
        precio 
    };
    carrito.push(producto);
    actualizarContador();
}

function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if(contador) {
        contador.innerText = carrito.length;
    }
}

function abrirCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total-carrito");
    lista.innerHTML = ""; 
    let totalSuma = 0;

    if (carrito.length === 0) {
        lista.innerHTML = "<p style='color: #888; text-align:center;'>El carrito está vacío :(</p>";
    } else {
        carrito.forEach((producto) => {
            const item = document.createElement("div");
            item.style.cssText = "display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:15px; border-bottom: 1px solid #333; padding-bottom: 10px;";

            item.innerHTML = `
                <span>${producto.nombre}</span>
                <div style="display:flex; align-items:center;">
                    <span style="font-weight:bold; margin-right:15px; color:#ff4757;">${producto.precio}</span>
                    <button onclick="eliminarDelCarrito(${producto.id})" style="background:none; border:none; color:#ff4757; cursor:pointer; font-size: 1.2rem;">🗑️</button>
                </div>
            `;
            lista.appendChild(item);

            let precioLimpio = parseInt(producto.precio.replace('$', '').replace('.', ''));
            totalSuma += precioLimpio;
        });
    }

    totalElemento.innerText = `Total: $${totalSuma.toLocaleString('es-AR')}`;
    document.getElementById("modalCarrito").style.display = "flex";
}

function eliminarDelCarrito(id) {
    // Filtramos para sacar solo el producto con ese ID
    carrito = carrito.filter(producto => producto.id !== id);
    actualizarContador();
    abrirCarrito(); // Redibujamos el modal
}

function finalizarPedido() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. ¡Agregá algo rico primero!");
        return;
    }

    let listaProductos = "";
    let total = 0;

    carrito.forEach(producto => {
        listaProductos += `- ${producto.nombre} (${producto.precio})\n`;
        let precioLimpio = parseInt(producto.precio.replace('$', '').replace('.', ''));
        total += precioLimpio;
    });

    const mensaje = `¡Hola Burger Station! 🍔\nQuisiera hacer el siguiente pedido:\n\n${listaProductos}\n*Total a pagar: $${total.toLocaleString('es-AR')}*`;

    const numeroWhatsApp = "5492915080682"; 
    const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(link, '_blank');
}

/* =========================================
   4. MODALES Y EVENTOS
   ========================================= */

// Configurar el botón del carrito en el Nav
const btnVerCarrito = document.getElementById("ver-carrito");
if(btnVerCarrito) {
    btnVerCarrito.onclick = function(e) {
        e.preventDefault();
        abrirCarrito();
    };
}

function abrirModal(titulo, descripcion, precio, imagenUrl) {
    document.getElementById("modalTitulo").innerText = titulo;
    document.getElementById("modalDesc").innerText = descripcion;
    document.getElementById("modalPrecio").innerText = precio;
    document.getElementById("modalImg").src = imagenUrl;

    let numeroWhatsApp = "5492915080682";
    let mensaje = `¡Hola Burger Station! 🍔 Quiero pedir: ${titulo}.`;
    let linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    document.getElementById("modalBtnPedido").href = linkWhatsApp;
    document.getElementById("modalPlato").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalPlato").style.display = "none";
}

function cerrarModalCarrito() {
    document.getElementById("modalCarrito").style.display = "none";
}

// Cerrar modales si hacen clic afuera
window.onclick = function(event) {
    let modalPlato = document.getElementById("modalPlato");
    let modalCarrito = document.getElementById("modalCarrito");
    
    if (event.target == modalPlato) cerrarModal();
    if (event.target == modalCarrito) cerrarModalCarrito();
}

// Arrancamos
renderizarPlatos();