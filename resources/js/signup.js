$(document).ready(function(){
    
    var form = $('.form');
    var btn = $('#submit');
    var topbar = $('.topbar');
    var input = $('#password');
    var h = input.height();
    $('.spanColor').height(h+23);
    $('#fullname').focus();

    input.on('focus',function(){
        topbar.removeClass('error success');
        input.text('');
    });

    $('body').keypress(function(e){
        if(e.keyCode==13)
            submit.click();
    });

    function checkHovaTen(){
        var tk = $('#fullname').val();
        if(tk.length === 0 ){
            $('#findpass').text('Không được bỏ trống họ và tên');
            return false;
        }
        //character data validation  
        if(!isNaN(tk)){  
            $('#findpass').text('Tên chỉ có thể là chữ cái');
            return false;  
        }  
        return true;
    }

    function checkEmail(){
        var email = $('#email'); 
        if(email.val().length === 0 ){
            $('#findpass').text('Không được bỏ trống E-mail');
            return false;
        }else{
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(email.val())) { 
                $('#findpass').text('Hãy nhập địa chỉ email hợp lệ. Ví dụ như: \nExample@gmail.com');
                email.focus();
                return false; 
            }
        }
        return true;
    }

    function checktk(){
        var tk = $('#username').val().length;
        if(tk === 0 ){
            $('#findpass').text('Không được bỏ trống tên đăng nhập');
            return false;
        }
        return true;
    }
    
    function checkpass(){
        var pass = $('#password').val();
        var pass1 = $('#password1').val();
        if(pass.length === 0 ){
            $('#findpass').text('Xin điền mật khẩu');
            return false;
        }
        if(pass1.length === 0 ){
            $('#findpass').text('Xin xác nhận lại mật khẩu');
            return false;
        }
        //minimum password length validation  
        if(pass.length < 8) {
            $('#findpass').text('Mật khẩu phải dài ít nhất 8 ký tự');
            return false;  
        }
        if(pass !== pass1) {
            $('#findpass').text('Mật khẩu không giống nhau');
            $('#password1').addClass('error');
            $('#password1').val("");
            $('#password1').focus();
            return false;  
        }
        return true;
    }

    btn.on('click',function(event){
        event.preventDefault();
        if(!checkHovaTen()) return;
        if(!checkEmail())   return;
        if(!checktk())     return;
        if(checkpass() === false){return;}
        var username = $('#username').val();
        var pass = $('#password').val();
        $.post("/account/check-account",{username: username, password: pass},function(data, status){
            var return_mode = data.return_mode;
            if(return_mode === 0){     //tai khoan chua co nguoi su dung, co the dang ky
                const bodyData = {
                    fullname: $('#fullname').val(),
                    email: $('#email').val(),
                    username: $('#username').val(),
                    password: $('#password').val()
                }
                $.post("/account/create-account",{fullname: bodyData.fullname,email:bodyData.email,username:bodyData.username,password:bodyData.password},
                function(data, status){
                    if(status === 406){
                        alert('Yêu cầu không được chấp thuận. Xin hãy thử lại sau');
                    }
                    console.log('back from create-account');
                });
                setTimeout(function(){
                    btn.text('Thành công!');
                    btn.addClass('success-color');
                    $('#findpass').text('Đăng ký thành công');
                },250);
                topbar.addClass('success');
                form.addClass('goAway');
                setTimeout(function(){
                    window.location.replace('account/verification');
                },500);
            }else{
                $('#username').addClass('error');
                $('#username').val("");
                $('#username').focus();
                $('#findpass').text('Tên đăng nhập đã có người sử dụng');
                setTimeout(function(){
                    $('#findpass').text('Xin hãy chọn một tên đăng nhập mới');
                },1500);
            } 
        });   
    });

    input.keypress(function(){
        topbar.removeClass('success error');
    });
});