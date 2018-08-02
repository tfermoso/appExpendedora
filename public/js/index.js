var monedasInsertadas = [];
var productoSeleccionado = "";

$.ajax({
    type: "get",
    url: "/",
    dataType: "json",
    success: function (response) {
        console.log(response);

        for (const producto in response.productos) {
            if (response.productos.hasOwnProperty(producto)) {
                var div = `<div id='${producto}' class='ranura ${producto}'></div>`;
                $('.productos').append(div);
            }
        }
        for (let i = 0; i < response["ranuras vacias"]; i++) {
            $('.productos').append("<div class='ranura espiral'></div>");
        }
        eventosRanuras();
    }
});


function eventosRanuras() {
    $('.ranura').click(ev => {
        productoSeleccionado = "";
        if (ev.currentTarget.id == "") {
            alert("ranura vacia");
        } else {
            console.log("Producto seleccionado: " + ev.currentTarget.id);
            var el = `#${ev.currentTarget.id}`;
            if ($(el).hasClass('ranuraSel')) {
                $('.ranura').removeClass('ranuraSel');
                $('.importe').html("0.00")
            } else {
                productoSeleccionado = ev.currentTarget.id;
                $('.ranura').removeClass('ranuraSel');
                $(el).addClass('ranuraSel');
                $.ajax({
                    type: "post",
                    url: "/precio",
                    data: { "producto": productoSeleccionado },
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                        $('.importe').html(response);
                    }
                });
            }
        }
    })
}


$('.monedas img').click((ev) => {
    var precioProducto = parseFloat($('.importe').html());
    var credito = parseFloat($('.credito').html());
    credito += parseFloat(ev.currentTarget.id);
    monedasInsertadas.push(parseFloat(ev.currentTarget.id));
    console.log(monedasInsertadas)
    $('.credito').html(credito.toFixed(2));
    if (credito >= precioProducto && productoSeleccionado != "") {
        comprarProducto(productoSeleccionado,monedasInsertadas);
    }

})

function comprarProducto(producto,credito) {    
        $.ajax({
            type: "post",
            url: "/comprar",
            data: {
                "producto": producto,
                "credito": JSON.stringify(credito)
            },
            dataType: "json",
            success: function (response) {
                console.log(response);
                var cambio = 0;
                response.result.cambio.forEach(ele => {
                    cambio += parseFloat(ele);
                });
                $('.credito').html(cambio.toFixed(2));
                $('.importe').html("0.00");

                response.result.mensaje.forEach(msg => {
                    $('#avisos').append(msg+"</br>");
                });
            }
        });
  
}


