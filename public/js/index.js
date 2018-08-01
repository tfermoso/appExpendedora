
$.ajax({
    type: "get",
    url: "/",
    dataType: "json",
    success: function (response) {
        console.log(response); 
               
        for (let i = 0; i < response["ranuras vacias"]; i++) {
            $('.productos').append("<div class='espiral'></div>");
            
        }
    }
});





