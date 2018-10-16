var fs = require('fs');

class Expendedora {

    static MONEDAS() { return [0.05, 0.1, 0.2, 0.5, 1, 2] };

    constructor(nombre, ranuras, profundidad, fichero) {
        this._nombre = nombre;
        this._ranuras = [];
        for (let i = 0; i < ranuras; i++) {
            this._ranuras.push([]);
        }
        this._profundid = profundidad;
        if (fichero != undefined) {
            this.cargarFichero(fichero);
        }
    }

    cargarProducto(producto) {
        var seguir = this._ranuras.some(ranura => {
            if (ranura.length > 0) {
                if (ranura[0].nombre == producto.nombre) {
                    while (ranura.length < this._profundid && producto.cantidad > 0) {
                        ranura.push({ "nombre": producto.nombre, "precio": producto.precio, "id": producto.id })
                        producto.cantidad--;
                    }
                    return true;
                }
            }

        });
        if (!seguir) {
            this._ranuras.some(ranura => {
                if (ranura.length == 0) {
                    while (ranura.length < this._profundid && producto.cantidad > 0) {
                        ranura.push({ "nombre": producto.nombre, "precio": producto.precio, "id": producto.id })
                        producto.cantidad--;
                    }
                    return true;
                }
            })
        }

    }

    cargarProductosDesdeFichero(fichero) {
        this.cargarFichero(fichero);
    }

    cargarMonedasDesdeFichero(fichero) {
        this.cargarFichero(fichero);
    }

    cargarFichero(fichero) {
        fs.readFile(fichero, 'utf-8', (err, data) => {
            if (err) {
                console.log("Error al leer el fichero ", fichero);
            } else {
                var datos = JSON.parse(data);
                if (datos[0].nombre != undefined) {
                    datos.forEach(producto => {
                        this.cargarProducto(producto);
                    });
                    // console.log(this._ranuras)  
                } else {
                    this.cargarMonedas(datos);
                    // console.log(this._cajetines);
                }
            }
        })
    }

    cargarMonedas(euros) {
        this._cajetines = {};
        Expendedora.MONEDAS().forEach(moneda => {
            this._cajetines[moneda] = {
                "capacidad": 50,
                "cantidad": 0
            }
        });
        this.meterMonedas(euros);
    }

    seleccionarProducto(nombreProducto) {
        for (let i = 0; i < this._ranuras.length; i++) {
            const element = this._ranuras[i];
            if (element.length > 0) {
                if (element[0].nombre == nombreProducto) {
                    // console.log("Hay "+element.length +" "+ nombreProducto +" de " +element[0].precio);
                    return element[0].precio;
                }
            }

        }
        return null;
        // console.log("Producto no encontrado");
    }

    meterMonedas(monedas){
        monedas.forEach(euro => {
            if (this._cajetines[euro.valor] != undefined) {
                this._cajetines[euro.valor].cantidad += euro.cantidad;
                if (this._cajetines[euro.valor].cantidad > this._cajetines[euro.valor].capacidad) {
                    this._cajetines[euro.valor].cantidad = this._cajetines[euro.valor].capacidad;
                    console.log("El cajetín " + euro.valor + " esta lleno");
                }          
            } else {
                console.log("No existe el cajetín para la moneda " + euro.valor);
            }
        });
    }

    meterMoneda(moneda) {
        if (this._cajetines[moneda] != undefined) {
            if (this._cajetines[moneda].cantidad < this._cajetines[moneda].capacidad) {
                this._cajetines[moneda].cantidad++;
                return true;
            }
        }
        return false;
    }

    sacarMoneda(moneda) {
        if (this._cajetines[moneda] != undefined) {
            if (this._cajetines[moneda].cantidad > 0) {
                this._cajetines[moneda].cantidad--;
                return true;
            }
        }
        return false;
    }

    comprarProducto(nombreProducto, monedas) {
        let devuelto = [];
        let msg = [];


        let precioProducto = this.seleccionarProducto(nombreProducto);
        if (precioProducto != null) {
            let dineroDisponible = 0;
            monedas.forEach(moneda => {
                if (this.meterMoneda(moneda)) {
                    dineroDisponible += moneda;
                } else {
                    msg.push("cajetín de " + moneda + " esta lleno")
                }
            })

            if (dineroDisponible >= precioProducto) {
                let cambio = (dineroDisponible - precioProducto).toFixed(2);
                // console.log("puedes comprarlo, te sobra "+(dineroDisponible-precioProducto));
                while (cambio > 0 && cambio >= this.monedasDisponibles()[this.monedasDisponibles().length - 1]) {
                    this.monedasDisponibles().some(moneda => {
                        if (cambio >= moneda) {
                            if (this.sacarMoneda(moneda)) {
                                devuelto.push(parseFloat(moneda));
                                cambio = (cambio - moneda).toFixed(2);
                                return true;
                            }
                        } //else if (cambio < 0.05 && cambio > 0.04) {
                        //     devuelto.push(0.05);
                        //     cambio = 0;
                        // }
                    })
                }
                if (cambio <= 0) {
                    msg.push("Procto comprado: " + nombreProducto);
                } else {
                    msg.push("Procto comprado: " + nombreProducto, " Alert! Máquina sin cambio");
                }
                this.sacarProducto(nombreProducto);

            } else {
                msg.push("No tienes dinero suficiente");
            }

        } else {
            msg.push("No existe el producto " + nombreProducto);
        }

        return {
            "cambio": devuelto,
            "mensaje": msg
        }
    }

    sacarProducto(nombre) {
        this._ranuras.some(ranura => {
            if (ranura.length > 0) {
                if (ranura[0].nombre == nombre) {
                    return ranura.pop();
                }
            }
        })
    }

    monedasDisponibles() {
        let monedas = [];
        for (const moneda in this._cajetines) {
            if (this._cajetines.hasOwnProperty(moneda)) {
                const element = this._cajetines[moneda];
                if (element.cantidad > 0)
                    monedas.push(moneda);
            }
        }
        return monedas.sort((a, b) => { return a - b }).reverse();
    }

    leerAvisos() {
        let avisos = {
            "cambio": 0,
            "cajetines llenos": [],
            "cajetines vacios": [],
            "productos": {},
            "ranuras vacias": 0
        };
        for (const moneda in this._cajetines) {
            if (this._cajetines.hasOwnProperty(moneda)) {
                // const element = this._cajetines[moneda];
                const element = this._cajetines[moneda];
                avisos.cambio += (element.cantidad * moneda);
                if (element.cantidad == element.capacidad)
                    avisos["cajetines llenos"].push(moneda);
                if (element.cantidad == 0)
                    avisos["cajetines vacios"].push(moneda);
            }
        }

        this._ranuras.forEach(ranura => {
            if (ranura.length > 0) {
                if (avisos.productos[ranura[0].nombre] == undefined) {
                    avisos.productos[ranura[0].nombre] = ranura.length;
                }
            } else {
                avisos["ranuras vacias"]++;
            }
        });

        return avisos;
    }

    vaciarCajetines(){
        let importe=0;
        for (const moneda in this._cajetines) {
            if (this._cajetines.hasOwnProperty(moneda)) {
                // const element = this._cajetines[moneda];
                const element = this._cajetines[moneda];
                importe += (element.cantidad * moneda);
                element.cantidad=0;
            }
        }
        return importe;
    }
}


module.exports= Expendedora;



