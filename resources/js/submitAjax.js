function addToCart(formId){
    const form = $(document).find(formId)
    
    const productQuantity = form.find("input[name='sl']").val();
    const  productId = form.find("input[name='id']").val();  //so luong sp them vao
    
    $.post('/users/add-to-cart',{id:productId,sl:productQuantity},function(data,status){
        if(data.result === undefined)
            window.location.assign('/login');
        if(status === "success"){
            //add thanh cong, lam cai j do
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