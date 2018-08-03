var monedasInsertadas = [];
var productoSeleccionado = "";
var cajetinesLlenos = [];

$.ajax({
    type: "get",
    url: "/",
    dataType: "json",
    success: function (response) {
        cajetinesLlenos = response["cajetines llenos"];
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
                        // Compruebo si hay saldo, si lo hay compro.

                    }
                });
            }
        }
    })
}


$('.monedas img').click((ev) => {
    var precioProducto = parseFloat($('.importe').html());
    console.log(cajetinesLlenos.indexOf(ev.currentTarget.id))
    if (cajetinesLlenos.indexOf(ev.currentTarget.id) > -1) {
        $('#avisos').append(`La máquina no acepta más monedas de ${ev.currentTarget.id}€</br>`);
        $('#avisos').scrollTop('9999');
    } else {
        var credito = parseFloat($('.credito').html());
        credito += parseFloat(ev.currentTarget.id);
        monedasInsertadas.push(parseFloat(ev.currentTarget.id));
        $('.credito').html(credito.toFixed(2));
        if (credito >= precioProducto && productoSeleccionado != "") {
            comprarProducto(productoSeleccionado, monedasInsertadas);
            monedasInsertadas=[];
        }
    }
})

function comprarProducto(producto, credito) {

    $.ajax({
        type: "post",
        url: "/comprar",
        data: {
            "producto": producto,
            "credito": JSON.stringify(credito)
        },
        dataType: "json",
        success: function (response) {
            var cambio = 0;
            var monedasDevueltas = "";
            response.result.cambio.forEach(ele => {
                monedasDevueltas += `${ele}€ `
                cambio += parseFloat(ele);
            });

            $('.credito').html("0.00");
            $('.importe').html("0.00");
            $('#avisos').append(`Tu cambio es ${cambio.toFixed(2)}€ </br>Monedas: ${monedasDevueltas}</br>`);
            response.result.mensaje.forEach(msg => {
                $('#avisos').append(msg + "</br>");
            });
            response.aviso["cajetines vacios"].forEach(c => {
                $('#avisos').append(`No hay monedas de ${c}€</br>`);
            })
            response.aviso["cajetines llenos"].forEach(c => {
                $('#avisos').append(`La máquina no acepta más monedas de ${c}€</br>`);
            })
            $('#avisos').scrollTop('9999');
            cajetinesLlenos = response.aviso["cajetines llenos"];

        }
    });

}


