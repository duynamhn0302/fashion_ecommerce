$(document).ready(function(){
    
    var name = $('#name');
    var email = $('#email');
    var phone = $('#phone');
    var address = $('#address');
    // var cause = $('#cause');
    // var source = $('#source');
    // var btn = $('.btn-trans');
    var sub = $('#sub');
    // var normal = $('#normal');
    // var error = $('#error');
    
    //initiate state
    $('#name').focus();
    // error.css('display','none');

    $('body').keypress(function(e){
        if(e.keyCode==13)
        sub.click();
    });

    function checknameNull(){
        var nameVal = name.val().length;
        if(nameVal === 0 ){
            console.log("name empty");
            swal("Nhắc nhở","Xin hãy điền tên shop","warning").then((value) => {
                name.focus();
            })
            // error.css('display','inherit');
            // normal.css('display','none');
            // btn.addClass("btn-trans-error");
            return false;
        }
        return true;
    }
    
    function checkemailNull(){
        if(email.val().length === 0 ){
            swal("Nhắc nhở","Xin hãy điền email shop","warning").then((value) => {
                email.focus();
            })
            // btn.addClass('btn-trans-error');
            // error.css('display','inherit');
            // normal.css('display','none');
            // email.focus();
            return false;
        }else{
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(email.val())) { 
                swal("Thông báo","Email shop không hợp lệ","info").then((value) => {
                    email.focus();
                })
                // btn.addClass('btn-trans-error');
                // error.css('display','inherit');
                // normal.css('display','none');
                // email.focus();
                return false; 
            }
        }
        return true;
    }

    function checkphoneNull(){
        var phoneVal = phone.val();
        if(phoneVal.length === 0 ){
            swal("Nhắc nhở","Xin hãy điền số điện thoại","warning").then((value) => {
                phone.focus();
            })
            // btn.addClass('btn-trans-error');
            // error.css('display','inherit');
            // normal.css('display','none');
            // phone.focus();
            return false;
        }
        var phoneno = /^\d{10}$/;
        if(phoneVal.match(phoneno)){}
        else{
            swal("Nhắc nhở","Số điện thoại không hợp lệ","warning").then((value) => {
                phone.focus();
            })
            // btn.addClass('btn-trans-error');
            // error.css('display','inherit');
            // normal.css('display','none');
            // phone.focus();
            return false;
        }
        return true;
    }

    function checkAddressNull(){
        var addressVal = address.val().length;
        if(addressVal === 0 ){
            console.log("address empty");
            swal("Nhắc nhở","Xin hãy điền địa chỉ của shop","warning").then((value) => {
                addtress.focus();
            })
            // error.css('display','inherit');
            // normal.css('display','none');
            // btn.addClass("btn-trans-error");
            // address.focus();
            return false;
        }
        return true;
    }

    function checktermNull(){
        var checkbox = $('#check');
        if(!checkbox.is(':checked')){
            swal("Nhắc nhở","Bạn chưa đồng ý với các chính sách và điều khoản thành lập shop","warning").then((value) => {
                checkbox.focus();
            })
            // btn.addClass('btn-trans-error');
            // error.css('display','inherit');
            // normal.css('display','none');
            // checkbox.focus();
            return false;
        }
        return true;
    }

    $('#sub').click(function(){
        if(checknameNull() === false){return;}
        if(checkemailNull() === false){return;}
        if(checkphoneNull() === false){return;}
        if(!checkAddressNull()) return;
        if(!checktermNull())    return;
        // btn.removeClass('btn-trans-error');
        // cause.text('Success !!');
        // source.text('');
        // setTimeout(function(){
        //     cause.text('Transferring you to another page !!!');
        // },1000);
        var return_mode = 0;
        var retUrl = '/';
        $.post("/account/add-shop",{
            name: name.val(), 
            phone: phone.val(), 
            email: email.val(),
            address: address.val(),
        },function(data, _status){
            return_mode = data.return_mode;
            // retUrl = data.retUrl;
            if(return_mode===0){
                swal("Thông báo","Đăng ký không thành công\nXin thử lại sau ít phút.","error").then((value) => {
                    setTimeout(function(){
                        window.location.replace('/');
                    },500);
                })
            }else{
                setTimeout(function(){
                    window.location.replace(retUrl);
                },500);
            }
        });   
    });

    // $(".close").on('click',function(){
    //     $('.overlay').removeClass('overlay-show');
    //     setTimeout(function(){
    //         window.location.replace('/');
    //     },500);
    // })
});