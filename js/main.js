// definimos nuestros parametros para arrancar la construccion de nuestros productos
class Producto{
    constructor(name, id, type, price, size){
        this.name = name;  // Pantalon tal
        this.id = id;  // 01
        this.type = type;  // Pantalon
        this.price = price;  // $$$
        this.size = size;  // S
    }
}


// Cargamos en el Local Strorage!!
const productos = JSON.parse(localStorage.getItem("productos")) || [] 
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []


// ---------------------------------------------------------------------------- //
// Buscamos nuestros productos cargados en el JSON (ya con esto, sabemos que productos tenemos disponibles)
const productosPreExistentes = async () =>{
    // si esta vacio el array, entonces hacemos un fetch
    if (productosPreExistentes.length === 0){ 
        try{
            // buscamos nuestro JSON con los productos ya creados
            const URLprodExistente = "/ProyectoFinal-Sabbatini, Martin/mercaderia.json"

            const productosBasePuro = await fetch(URLprodExistente)
            const productosBase = await productosBasePuro.json()
            productosBase.forEach(prod =>{
                let dato = JSON.parse(JSON.stringify(prod))
                agregarProducto(dato) // ejecutamos esta def por ser verdadera
            })
        } catch(err) {
            console.error("Error en la base de datos")
        } finally {
            renderizarProductos(productos) // ejecutamos esta def 
        }
    } else {
        renderizarProductos(productos) // ejecutamos esta def
    }
}


// Para agregar nuestros productos a la base de datos o LocalStorage (FUNCIONAAAAA)
const agregarProducto = ({name, id, type, price, size}) => {
    // buscamos con el id si existe
    if(productos.some(prod => prod.id === id)){
        pass
    } else {  // creamos el producto en base a los datos del JSON
        const nuevoProducto = new Producto(name, id, type, price, size)
        productos.push(nuevoProducto)  // guardamos en el array
        localStorage.setItem("productos", JSON.stringify(productos))  // lo subimos al localstorage convertido
    }
}


// ---------------------------------------------------------------------------- //
// agregar productos al carrito

const totalCarrito = () => {
    let total = carrito.reduce((acumulador, {price, quantity}) => {
        return acumulador + (price*quantity)
    }, 0)
    return total
}

// calcula el total del carrito
const TotalCarritoRender = () => {
    const carritoTotal = document.getElementById("carritoTotal")
    carritoTotal.innerHTML = `Precio Total: $ ${totalCarrito()}`
}

const agregarCarrito = (objetoCarrito) => {
    carrito.push(objetoCarrito)
    TotalCarritoRender()
}

// renderizamos para que se vea en el HTML (mismos paso que el de productos)
const renderizarCarrito = () => {
    const listaCarrito = document.getElementById("listaCarrito")
    listaCarrito.innerHTML = "" 

    carrito.forEach(({name, id, price, quantity}) => { 
        let elementoTabla = document.createElement("tr")
        elementoTabla.innerHTML = `
                <td>${name}</td>
                <td>${price}</td>
                <td>${quantity}</td>
                <td>
                    <button id="eliminarCarrito${id}">X</button>
                </td>`
        
        listaCarrito.appendChild(elementoTabla)

        // boton borrar
        const botonBorrar = document.getElementById(`eliminarCarrito${id}`)
        botonBorrar.addEventListener("click", () => {
            carrito = carrito.filter((elemento) => {
                if(elemento.id !== id){
                    return elemento
                }
            })
            let carritoString = JSON.stringify(carrito)
            localStorage.setItem("carrito", carritoString)
            renderizarCarrito()
        })
        let carritoString = JSON.stringify(carrito)
        localStorage.setItem("carrito", carritoString)
    })
}

// ---------------------------------------------------------------------------- //
// Para mostrar nuestros productos en el HTML
const renderizarProductos = (arrayProdUsado) => {
    // lo ubicamos en el div del DOM llamado...
    const contenedorProductos = document.getElementById("containerProductos")
    // para evitar que se dupliquen cada vez que reiniciamos la pag...
    contenedorProductos.innerHTML = ""  // dejamos ese espacio en blanco cada vez que se ejecuta y llega a esta parte
    
    
    arrayProdUsado.forEach(({name, id, type, price, size}) => { // analizamos uno x uno con each
        const plantillaRenderizada = document.createElement("div") // creamos un div para dejarlo mas organizado
        plantillaRenderizada.classList.add("col-xs")
        plantillaRenderizada.classList.add("card") // agregamos estas 2 clases para que bobstrap haga lo demas
        plantillaRenderizada.style = "width: 270px;height: 620px; margin:3px"  // agregamos un estilo
        
        plantillaRenderizada.id = id  // agarramos el id para las fotos
        plantillaRenderizada.innerHTML = `
                <img src="../assets/mercaderia/${id}.webp" class="card-img-top" alt="${name}"> 
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <h6>${type}</h6>
                    <h6>Talla: ${size}</h6>
                    <span>$ ${price}</span>

                    <form id="form${id}" style="padding: 8px; display: flex; justify-content: center; flex-direction: column">
                        <label for="contador${id}">Cantidad</label>
                        <input type="number" placeholder="0" id="contador${id}">
                        <div style="display: flex; justify-content: center; padding: 10px">
                            <button class="btn btn-primary boton-agregar" id="botonProd${id}">Agregar al Carrito</button>
                        </div>
                    </form>
                </div>`
        contenedorProductos.appendChild(plantillaRenderizada)

        //-------------------------------------------------------- //
        // esto es para dar funcionalidad al boton agregar carrito
        // buscamos en el dom
        const btn = document.getElementById(`botonProd${id}`)
        btn.addEventListener("click", (e) =>{
            e.preventDefault()
            const contadorQuantity = Number(document.getElementById(`contador${id}`).value) // cantidad adquirida
            if(contadorQuantity > 0){
                if(carrito.some(producto => producto.id === id)){
                    carrito = carrito.map(element => {
                        if(element.id === id){
                            element.quantity += contadorQuantity
                        }
                        return element
                    })
                } else {
                    agregarCarrito({name, id, type, price, size, quantity:contadorQuantity})
                }
                renderizarCarrito()
                const form = document.getElementById(`form${id}`)
                form.reset()
                Swal.fire({
                    icon: 'success',
                    title: `Agrego ${contadorQuantity} ${name} al carrito`,
                    showConfirmButton: true,
                    timer: 2500
                })
                
            }
        })
    })
}



// ---------------------------------------------------------------------------- //
// 7mo intento para conseguir que los filtros no se molesten entre si (Funciona)
let sizeFiltro = "0"; // iniciamos la variable filtro en size en 0
let typeFiltro = "0"; 

// Función para renderizar los productos con los filtros aplicados
function renderizarProductosConFiltros() {
  // filtramos productos basados en el size y type
  const productosFiltrados = productos.filter((prod) => {
    const cumpleFiltroSize = (sizeFiltro === "0" || prod.size === sizeFiltro);
    const cumpleFiltroType = (typeFiltro === "0" || prod.type === typeFiltro);
    // retornamos por ser una def
    return cumpleFiltroSize && cumpleFiltroType;
  });
  // llamamos a la def de renderizado con los productos ya filtrados
  renderizarProductos(productosFiltrados);
}

const selectorSize = document.getElementById("TalleSeleccionado"); // usamos dom
selectorSize.onchange = (evt) => {
  sizeFiltro = evt.target.value; // vemos el tamaño seleccionado
  renderizarProductosConFiltros(); // renderizamos de nuevo y comprobamos
};

const selectorType = document.getElementById("TipoSeleccionado"); // usamos dom
selectorType.onchange = (evt) => {
  typeFiltro = evt.target.value; // emos el tipo seleccionado
  renderizarProductosConFiltros(); // renderizamos de nuevo y comprobamos
};




// Para ejecutar
const principal = () => {
    productosPreExistentes()
    renderizarCarrito()
    TotalCarritoRender()
}

principal()