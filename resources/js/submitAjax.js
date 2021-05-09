function love(formId){
    $(formId).submit(function(event) {
        var button = $(this).find("a")
        const html = button.html()

        button.html(
            `<i class="fa fa-spinner fa-spin"></i>Loading`
        );
        setTimeout( 
        function  (){  
            button.html(html);
            
        }, 1000);
        $.ajax({
            method: $(this).attr('method'),
            url: $(this).attr('action'),
            data: {
                id: $(this).find("input").attr("value"),
            },		
            
        }).done(function(response) {		
            
        });
        event.preventDefault(); // <- avoid reloading
    });
    $(formId).submit();
}
function addToCart(formId){
   
    $(formId).submit(function(event) {
        var button = $(this).find("a")
        const html = button.html()
        button.html(
            `<i class="fa fa-spinner fa-spin"></i>Loading`
        );
        setTimeout( 
        function  (){  
            button.html(html);
            
        }, 1000);
        $.ajax({
            method: $(this).attr('method'),
            url: $(this).attr('action'),
            data: {
                id: $(this).find("input").attr("value"),
            },		
            
        }).done(function(response) {		
            
        });
        event.preventDefault(); // <- avoid reloading
    });
    $(formId).submit();
}