var category = null;
var save = 0;

$.post('/shops/cat-1',function(data,status){
    category = data;
    if(category !== null){
        const len = category.length;
        for(var i=0;i<len;i++){
            $('#cat-1-select').append(`<div class="item-select-cbx first-item">
            ${category[i].ten}
        </div>`)
        }
    }
    if(cat1Num !== 0){
        $('#cat-1-select .item-select-cbx:nth-of-type('+cat1Num+")").click();
        $(`#cat-2-select .item-select-cbx[data-maso="${cat2Num}"]`).click();
    }
})

$(document).ready(function(){
    const cat_1 = $('.add-shop-category-1');
    const cat_2 = $('.add-shop-category-2');
    var choose_cat_1;

    const hideComboBox = ()=>{
        $('.drop-down-cbx').addClass("disable");
        $('.drop-down-cbx').removeClass("show");
    }

    $(this).on('click',hideComboBox);

    $('.combo_box').on('click',function(e){
        const dropdown = $(this).next();
        dropdown.removeClass("disable");
        dropdown.toggleClass("show");
        $(this).children('div').children('i').toggleClass("rotate");
        e.stopPropagation();
    })

    $('#cat-1-select').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        choose_cat_1 = $(this).index();
        // alert(choose_cat_1);
        if(category[choose_cat_1].existsCate2===false)  return;
        $('.add-shop-category-2').css('display','block');
        $('#cat-2-select').empty();
        $('#span-2').text(`${category[choose_cat_1].cate2[0].ten}`);
        $('#span-2').attr('data-maso',`${category[choose_cat_1].cate2[0].maso}`);
        const len = category[choose_cat_1].cate2.length;
        for(var i=0;i<len;i++){
            $('#cat-2-select').append(`<div class="item-select-cbx first-item" data-maso="${category[choose_cat_1].cate2[i].maso}">
            ${category[choose_cat_1].cate2[i].ten}
        </div>`)
        }
    })

    $('#cat-2-select').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.attr('data-maso',$(this).attr('data-maso'));
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
    })

    $('#sex').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
    })

    $('#size').on('click','.item-select-cbx',function(){
        const temp = $(this).parent('div').prev('.combo_box').children('div').children('.selected');
        temp.text($(this).text());
        temp.next('i').toggleClass('rotate');
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
    })

    function checkVal(){
        if($('#tensanpham').val().length === 0){
            alert('Xin hãy nhập tên sản phẩm');
            return false;
        }
        if($('#span-2').text() === ' ' || $('#span-2').text() === ''){
            alert('Bạn chưa chọn danh mục cấp 2');
            return false;
        }
        if(editor.getData().length === 0){
            alert('Xin hãy nhập mô tả');
            return false;
        }
        if($('#noisanxuat').val().length === 0){
            alert('Xin hãy nhập nơi sản xuất');
            return false;
        }
        if($('#kichthuoc').text().length === 0){
            alert('Xin hãy nhập kích thước');
            return false;
        }
        if($('#giaban').val().length === 0){
            alert('Xin hãy nhập giá bán của sản phẩm');
            return false;
        }
        if($('#soluong').val().length === 0){
            alert('Xin hãy nhập số lượng sản phẩm muốn bán');
            return false;
        }
        return true;
    }

    function checkMinimumPhoto(){
        if(minimum_photo === false && edit === false)  {
            alert('Bạn chưa upload bất cứ hình sản phẩm nào');
            return false;
        }
        return true
    }

    $('#save').on('click',function(e){
        if(!checkVal()) return;
        if(!checkMinimumPhoto()) return;
        // alert(edit);
        const data = {
            tensanpham: $('#tensanpham').val(),
            danhmuccap2: +$('#span-2').attr('data-maso'),
            noisanxuat: $('#noisanxuat').val(),
            kichthuoc: $('#kichthuoc').text().trim(),
            gioitinhsudung: $('#gioitinhsudung').text().replace(/\s/g, ""),
            mota: editor.getData(),
            giaban: +$('#giaban').val(),
            soluong: +$('#soluong').val()
        }
        // console.log(data);
        
        if(!edit){       //dang moi san pham
            save = 1; 
            $.post('/shops/add-product',data,function(data,status){
                // alert('Thành công');
                window.location.replace('/shops/products');
            })
        }else{          //cap nhat san pham
            save = 1;
            $.post('/shops/edit-product',data,function(data,status){
                // alert('Thành công');
                window.location.replace('/shops/products');
            })
        }
    })

    $('#delete').on('click',function(e){
        e.preventDefault();
        $('#tensanpham').val('')
        $('#noisanxuat').val('')
        $('#kichthuoc').text('')
        $('#editor').text('')
        $('#giaban').val('')
        $('#soluong').val('')
        //cbx alter
        $('#span-2').text("&nbsp;");
        $('#span-2').attr('data-maso','0');
        setTimeout(function(){window.location.href = "#topOfPage"},0);
        return false;
    })

    $('#back').on('click',function(){
        setTimeout(function(){window.location.href = "/shops/incomes"},0);  //khong biet co nen de href hay khong
    })
})

window.addEventListener('beforeunload', function (e) {
    if(save === 0){
        $.post('/shops/unloadFakeProduct',{},function(data,status){
            //finished unload fakeProduct
        })
    }else{
        //do nothing
    }
});