//script cua add-to-cart gia du bam vo form, hay la nut gi cungx dc, tu sua tuy truong hop
$('#form').on('submit',function(e){
    const productId = 1;
    const productQuantity = 3;  //so luong sp them vao
    $.post('/users/add-to-cart',{id:productId,sl:productQuantity},function(data,status){
        if(data === true){
            //add thanh cong, lam cai j do
            //do nothing
            e.preventDefault();
        }else{
            //add khong thanh cong
            window.location.href('/login');
        }
    })
})

//script cua mua ngay gia du bam vo form, hay la nut gi cungx dc, tu sua tuy truong hop
$('#form').on('submit',function(e){
    const productId = 1;
    const productQuantity = 1;  //so luong sp them vao, co dinh la 1
    $.post('/users/add-to-cart',{id:productId,sl:productQuantity},function(data,status){
        if(data === true){
            //add thanh cong, lam cai j do
            //do nothing
            window.location.href('/users/shopping-cart');
        }else{
            //add khong thanh cong
            window.location.href('/login');
        }
    })
})
