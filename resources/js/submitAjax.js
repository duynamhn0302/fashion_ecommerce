function addToCart(formId){
    const form = $(document).find(formId)
    
    const productQuantity = form.find("input[name='sl']").val();
    const  productId = form.find("input[name='id']").val();  //so luong sp them vao
    
    $.post('/users/add-to-cart',{id:productId,sl:productQuantity},function(data,status){
        if(data.result === undefined)
            window.location.assign('/login');
        if(status === "success"){
            //add thanh cong, lam cai j do
            $('#add-success').addClass('d-show1');
            $('#add-success').addClass('roll-in-right');
            setTimeout(function(e){
                $('#add-success').removeClass('roll-in-right');
                $('#add-success').addClass('scale-out-tr');
            },100)
            setTimeout(function(e){
                $('#add-success').removeClass('scale-out-tr');
                $('#add-success').removeClass('d-show1');
            },3000)
            //do nothin
            form.find("input[name='sl']").val("1")
            $(document).find("#slGioHang").html(data.result)
            e.preventDefault();
        }else{
            //add khong thanh cong
            
            window.location.assign('/login');
        }
    });
  
}

// $(document).ready(function(){
//     console.log('ready');
//     $('#test').on('click',function(e){
//         console.log('press');
//         $('#add-success').addClass('d-show');
//         $('#add-success').addClass('roll-in-right');
//         setTimeout(function(e){
//             $('#add-success').removeClass('roll-in-right');
//             $('#add-success').addClass('scale-out-tr');
//         },1000)
//         setTimeout(function(e){
//             $('#add-success').removeClass('scale-out-tr');
//             $('#add-success').removeClass('d-show');
//         },2600)
//     })
// })

function muaNgay(formId){
    const form = $(document).find(formId)
    
    const productId = form.find("input[name='id']").val();
    const productQuantity = 1;  //so luong sp them vao
    
    $.post('/users/add-to-cart',{id:productId,sl:productQuantity},function(data,status){
        if(data.result === undefined)
            window.location.assign('/login');
        if (status === "success"){
            location.assign("/users/shopping-cart");
        }
        else
            location.assign("/login");
    });
  
}