function addToCart(formId){
    const form = $(document).find(formId)
    
    const productQuantity = form.find("input[name='sl']").val();
    const  productId = form.find("input[name='id']").val();  //so luong sp them vao
    
    $.post('/users/add-to-cart',{id:productId,sl:productQuantity},function(data,status){
        if(data.result === undefined)
            window.location.assign('/login');
        if (data.success){
            //add thanh cong, lam cai j do
            $('#add-success-img-container').html('<i  class="far fa-check-circle"></i>');
            $('#msg').text('Thêm vào giỏ hàng thành công');
            $('#add-success').addClass('d-show1');
            $('#add-success').addClass('roll-in-right');
            setTimeout(function(e){
                $('#add-success').removeClass('roll-in-right');
                $('#add-success').addClass('scale-out-tr');
            },1000)
            setTimeout(function(e){
                $('#add-success').removeClass('scale-out-tr');
                $('#add-success').removeClass('d-show1');
            },2600)
            //do nothin
            form.find("input[name='sl']").val("1")
            $(document).find("#slGioHang").html(data.result)
            e.preventDefault();
        }
        else{
            $('#add-success-img-container').html('<i class="fa fa-exclamation"></i>')
            $('#msg').text('Sản phẩm trong kho không đủ')
            $('#add-success').addClass('d-show1');
            $('#add-success').addClass('roll-in-right');
            setTimeout(function(e){
                $('#add-success').removeClass('roll-in-right');
                $('#add-success').addClass('scale-out-tr');
            },1000)
            setTimeout(function(e){
                $('#add-success').removeClass('scale-out-tr');
                $('#add-success').removeClass('d-show1');
            },2600)
            //do nothin
            $(document).find("#slGioHang").html(data.result)
            e.preventDefault();
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