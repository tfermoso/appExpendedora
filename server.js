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

app.post('/precio',(req,res)=>{
    let precio=maquina.seleccionarProducto(req.body.producto);    
    res.send(JSON.stringify(precio));
})

app.post('/comprar',(req,res)=>{  
    console.log(req.body);
    var result=maquina.comprarProducto(req.body.producto,JSON.parse(req.body.credito));
    var avisos=maquina.leerAvisos();
    var respuesta={
        "result": result,
        "aviso":avisos
    }
    res.send(JSON.stringify(respuesta));
})

app.use(express.static('public'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))