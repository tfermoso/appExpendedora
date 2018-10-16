const Expendedora = require('./Expendedora');
const express = require('express');
var bodyParser = require('body-parser');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var maquina = new Expendedora("máquina 1", 18, 10, "monedas.json");
maquina.cargarProductosDesdeFichero("productos.json");

app.get('/', (req, res) => res.send(
    JSON.stringify(maquina.leerAvisos())
))

app.post('/precio', (req, res) => {
    let precio = maquina.seleccionarProducto(req.body.producto);
    res.send(JSON.stringify(precio));
})

app.post('/comprar', (req, res) => {
    var result = maquina.comprarProducto(req.body.producto, JSON.parse(req.body.credito));
    var avisos = maquina.leerAvisos();
    var respuesta = {
        "result": result,
        "aviso": avisos
    }
    res.send(JSON.stringify(respuesta));
})

app.get('/vaciar', (req, res) => {
    let importe = maquina.vaciarCajetines()

    res.send(JSON.stringify({ "importe": importe }))
})

app.post('/cargarMonedas', (req, res) => {

    let datos = JSON.parse(req.body.datos);

    let monedas = [];

    for (const moneda in datos) {
        if (datos.hasOwnProperty(moneda)) {
            const cantidad = parseInt(datos[moneda]);
            monedas.push({
                "valor": moneda,
                "cantidad": cantidad
            })
        }
    }
    maquina.meterMonedas(monedas);
    res.send(JSON.stringify(maquina.leerAvisos()));
})

app.use(express.static('public'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))