const Expendedora = require('./Expendedora');
const express = require('express');


const app = express();
var maquina = new Expendedora("máquina 1", 18, 10, "monedas.json");
maquina.cargarProductosDesdeFichero("productos.json");

app.get('/', (req, res) => res.send(
    JSON.stringify(maquina.leerAvisos())
))

app.use(express.static('public'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))