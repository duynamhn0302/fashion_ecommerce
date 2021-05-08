$(document).ready(function(){
    
    var form = $('.form');
    var btn = $('#submit');
    var topbar = $('.topbar');
    var input = $('#password');
    var article =$('.article');
    var tries = 0;
    var h = input.height();
    $('.spanColor').height(h+23);
    $('#username').focus();

    input.on('focus',function(){
        topbar.removeClass('error success');
        input.text('');
    });

    $('body').keypress(function(e){
        if(e.keyCode==13)
        submit.click();
    });

    function checktkNull(){
        var tk = $('#username').val().length;
        if(tk === 0 ){
            $('#findpass').text('Không được bỏ trống tên đăng nhập');
            return false;
        }
        return true;
    }
    
    function checkpassNull(){
        var pass = $('#password').val().length;
        if(pass === 0 ){
            $('#findpass').text('Xin điền mật khẩu');
            return false;
        }
        return true;
    }

    btn.on('click',function(){
        if(checktkNull() === false){return;}
        if(checkpassNull() === false){return;}
        var return_mode = 0;
        var retUrl = '/';
        var username = $('#username').val();
        var pass = $('#password').val();
        $.post("/account/check-account",{username: username, password: pass},function(data, status){
            return_mode = data.return_mode;
            retUrl = data.retUrl;
            if(tries<=2){
                if(return_mode === 2){
                    setTimeout(function(){
                        btn.text('Thành công!');
                        btn.addClass('success-color');
                        $('#findpass').text('Đăng nhập thành công');
                    }
                    ,250);
                    topbar.addClass('success');
                    form.addClass('goAway');
                    article.addClass('active');
                    tries=0;
                    setTimeout(function(){
                        const url = retUrl || '/';
                        window.location.replace(url);
                    },500);
                }else{
                    if(return_mode === 1){
                        $('#findpass').text('Mật khẩu sai');
                    }else{
                        $('#findpass').text('Tài khoản không hợp lệ');
                    }
                    topbar.addClass('error');
                    tries++;
                    switch(tries){
                        case 0:
                        btn.text('Đăng nhập');
                        break;
                        case 1:
                        setTimeout(function(){
                        btn.text('Bạn còn 2 lần thử');
                        },300);
                        break;
                        case 2:
                        setTimeout(function(){
                        btn.text('Còn 1 lần cuối');
                        },300);
                        break;
                        case 3:
                        setTimeout(function(){
                        btn.text('Quên mật khẩu?');
                        },300);
                        input.prop('disabled',true);
                        topbar.removeClass('error');
                        input.addClass('disabled');
                        btn.addClass('recover');
                        break;
                        default:
                        btn.text('Đăng nhập');
                        break;
                    }
                } 
            }else{
                topbar.addClass('disabled');
            }
        });   
    });

    
    input.keypress(function(){
    topbar.removeClass('success error');
    });
});