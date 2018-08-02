
$.ajax({
    type: "get",
    url: "/",
    dataType: "json",
    success: function (response) {
        console.log(response); 
        for (const producto in response.productos) {
            if (response.productos.hasOwnProperty(producto)) {
                var div=`<div class='ranura ${producto}'></div>`;
                $('.productos').append(div);
                
            }
        }     
        for (let i = 0; i < response["ranuras vacias"]; i++) {
            $('.productos').append("<div class='ranura espiral'></div>");
            
        }
    }
});





