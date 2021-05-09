$(document).ready(function(){
    
    var name = $('#name');
    var email = $('#email');
    var phone = $('#phone');
    var cause = $('#cause');
    var source = $('#source');
    var btn = $('.btn-trans');
    var sub = $('#sub');
    var normal = $('#normal');
    var error = $('#error');
    
    //initiate state
    $('#name').focus();
    error.css('display','none');

    $('body').keypress(function(e){
        if(e.keyCode==13)
        sub.click();
    });

    function checknameNull(){
        var nameVal = name.val().length;
        if(nameVal === 0 ){
            console.log("name empty");
            cause.text("Please fill up your");
            source.text('Shop name');
            error.css('display','inherit');
            normal.css('display','none');
            btn.addClass("btn-trans-error");
            name.focus();
            return false;
        }
        return true;
    }
    
    function checkemailNull(){
        if(email.val().length === 0 ){
            cause.text('Please fill up your');
            source.text('Shop email');
            btn.addClass('btn-trans-error');
            error.css('display','inherit');
            normal.css('display','none');
            email.focus();
            return false;
        }else{
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(email.val())) { 
                cause.text('Invalid');
                source.text('Shop email');
                btn.addClass('btn-trans-error');
                error.css('display','inherit');
                normal.css('display','none');
                email.focus();
                return false; 
            }
        }
        return true;
    }

    function checkphoneNull(){
        var phoneVal = phone.val();
        if(phoneVal.length === 0 ){
            cause.text('Fill up your');
            source.text('Shop phone number');
            btn.addClass('btn-trans-error');
            error.css('display','inherit');
            normal.css('display','none');
            phone.focus();
            return false;
        }
        var phoneno = /^\d{10}$/;
        if(phoneVal.match(phoneno)){}
        else{
            cause.text('Invalid');
            source.text('Shop phone number');
            btn.addClass('btn-trans-error');
            error.css('display','inherit');
            normal.css('display','none');
            phone.focus();
            return false;
        }
        return true;
    }

    function checktermNull(){
        var checkbox = $('#check');
        if(!checkbox.is(':checked')){
            cause.text('You have not accepted');
            source.text('terms.');
            btn.addClass('btn-trans-error');
            error.css('display','inherit');
            normal.css('display','none');
            checkbox.focus();
            return false;
        }
        return true;
    }

    $('#sub').click(function(){
        if(checknameNull() === false){return;}
        if(checkemailNull() === false){return;}
        if(checkphoneNull() === false){return;}
        if(!checktermNull())    return;
        btn.removeClass('btn-trans-error');
        cause.text('Success !!');
        source.text('');
        setTimeout(function(){
            cause.text('Transferring you to another page !!!');
        },1000);
        var return_mode = 0;
        var retUrl = '/';
        $.post("/account/add-shop",{name: name.val(), phone: phone.val(), email: email.val()},function(data, _status){
            return_mode = data.return_mode;
            // retUrl = data.retUrl;
            if(return_mode===0){
                $('.overlay').addClass('overlay-show');
            }else{
                setTimeout(function(){
                    window.location.replace(retUrl);
                },1000);
            }
        });   
    });

    $(".close").on('click',function(){
        $('.overlay').removeClass('overlay-show');
        setTimeout(function(){
            window.location.replace('/');
        },500);
    })

    $('input').keypress(function(){
        topbar.removeClass('success error');
    });
});